import GameElo from "../../models/gameEloSchema.js";
import { versusEloCalculator } from "../elo-calculators/versusEloScoreCalculator.js";

export async function versusEloHandler(game, teamOne, teamTwo, winningTeam) {
    // just get the _id's from the winners, losers and drawers arrays and assign them to an array
    const teamOneIds = teamOne.map((player) => player._id); // team_one will be an array of _id's - map() always makes an array
    const teamTwoIds = teamTwo.map((player) => player._id); // team_two will be an array of _id's

    //do a specific ELO calculation if the game type is a 1v1 situation

    // if there is a whole team playing, get the elo score of the collective team one - otherwise the sum of 1 player(no team) will be itself
    let teamOneEloSum = 0;
    const teamOneElos = await Promise.all(
        // need to get the GameElo records of each player on the team first, since it's not recommended to have async functions in a ForEach
        teamOne.map(async (player) => {
            return await GameElo.findOneAndUpdate(
                {
                    game: game._id,
                    player: player._id,
                },
                {
                    game: game._id,
                    player: player._id,
                },
                { upsert: true, new: true }
            );
        })
    );
    teamOneElos.forEach((player) => {
        // need to get the GameElo records of each player on the team first, since it's not recommended to have async functions in a ForEach
        teamOneEloSum += player.elo_score;
    });
    console.log(`Sum of Team One's Elo Scores: ${teamOneEloSum}`);
    const teamOneAvgElo = teamOneEloSum / teamOneIds.length;
    console.log(`Average of Team One's Elo Scores: ${teamOneAvgElo}\n`);

    // if there is a whole team playing, get the elo score of the collective team that lost - otherwise the sum of 1 loser(no team) will be itself
    let teamTwoEloSum = 0;
    const teamTwoElos = await Promise.all(
        teamTwo.map(async (player) => {
            return await GameElo.findOneAndUpdate(
                {
                    game: game._id,
                    player: player._id,
                },
                {
                    game: game._id,
                    player: player._id,
                },
                { upsert: true, new: true }
            );
        })
    );
    teamTwoElos.forEach((player) => {
        teamTwoEloSum += player.elo_score;
    });
    console.log(`Sum of Team Two's Elo Scores: ${teamTwoEloSum}`);
    const teamTwoAvgElo = teamTwoEloSum / teamTwoIds.length;
    console.log(`Average of Team Two's Elo Scores: ${teamTwoAvgElo}\n`);

    // this is another way of writing the forEach((player) => {losersEloSum += player.elo_score}) part:
    // let x = playersWon.reduce(((sumSoFar, player ) => {return player.elo_score + sumSoFar} ),0)
    // console.log(x)
    // console.log(winnersEloSum)

    // if the the user with higher elo won = 1, if the user with high elo lost = 0, if there is a draw, = 0.5
    // --------- add functionality for comparing the actual outcome vs the expected outcome ----- need to add another variable in body of request

    // idea --- could make expected outcome for draws true or false depending on team one and team two's elo scores...
    // for example, if the scores are drastically different, then it wouldn't be expected if it was a draw.
    // this would negatively impact the higher-elo players and positively impact the lower-elo scored players
    // but to a lesser extent than winning or losing.
    let expectedOutcome;

    if (
        // these are the EXPECTED outcomes

        // --- idea: this might be too restrictive for an "expected draw" for the teams to have exactly the same score....
        // might want it to = true if the elo scores are within a certain range of each other.
        (teamOneEloSum === teamTwoEloSum && winningTeam === 0.5) || // if teams have the same elo, and draw, OR
        // the >= will need to be changed to > if making a range of "expected draws"
        (teamOneEloSum >= teamTwoEloSum && winningTeam === 1) || // if team one is expected to win and does, OR
        (teamOneEloSum <= teamTwoEloSum && winningTeam === 2) // if team two is expected to win and does
    ) {
        expectedOutcome = true; // then the expected outcome came true; expectedOutcome = 1
    } else if (
        // these are the UNEXPECTED outcomes
        (teamOneEloSum < teamTwoEloSum && winningTeam === 1) || // if team one isn't expected to win but does
        (teamOneEloSum > teamTwoEloSum && winningTeam === 2) || // if team two isn't expected to win but does
        // --- idea: this might be too inclusive for an rewarding the underdog....
        // might want it to = false if the elo scores are within a certain range AWAY from each other.
        (teamOneEloSum > teamTwoEloSum && winningTeam === 0.5) || // if team one is expected to win but draws
        (teamOneEloSum < teamTwoEloSum && winningTeam === 0.5) // if team two is expected to win but draws
    ) {
        expectedOutcome = false; // then the expected outcome is false; expectedOutcome = 0
    }

    console.log(`\nWho Won?`);
    if (winningTeam === 1) {
        console.log(
            `Team One Won! Congrats ${teamOne.map((player) => player.username)}`
        );
    } else if (winningTeam === 2) {
        console.log(
            `Team Two Won! Congrats ${teamTwo.map((player) => player.username)}`
        );
    } else if (winningTeam === 0.5) {
        console.log(`There was a draw!`);
    }
    // console.log(
    //     `\nExpected Outcome: ${expectedOutcome}\nLEGEND:\n- 1 when the higher-elo team won;\n- 0 when the higher-elo team lost;\n- 0.5 for a tie`
    // );

    let winnerUpdateResult;
    let loserUpdateResult;
    // when the higher elo team wins
    // calculate what the elo scores should be updated to for each winner -- then do losers below
    // do one user's elo calculation at a time - if a GameElo is not found, create it

    const teamOneCurrentElos = await Promise.all(
        teamOneIds.map(async (winnerElo) => {
            return await GameElo.findOneAndUpdate(
                {
                    game: game._id,
                    player: winnerElo._id,
                },
                {
                    game: game._id,
                    player: winnerElo._id,
                },
                { upsert: true, new: true }
            ).populate("player", "username");
        })
    );

    const teamTwoCurrentElos = await Promise.all(
        teamTwoIds.map(async (loserElo) => {
            return await GameElo.findOneAndUpdate(
                {
                    game: game._id,
                    player: loserElo._id,
                },
                {
                    game: game._id,
                    player: loserElo._id,
                },
                { upsert: true, new: true }
            ).populate("player", "username");
        })
    );
    for (let i = 0; i < teamOneIds.length; i++) {
        // getting the individual GameElo record for winner and loser for each loop:

        let teamOneCurrentElo = teamOneCurrentElos[i];
        let teamTwoCurrentElo = teamTwoCurrentElos[i];

        // getting the current elo scores for the game before calculating updated elo values
        let teamOneCurrentEloScore = teamOneCurrentElo.elo_score;
        let teamTwoCurrentEloScore = teamTwoCurrentElo.elo_score;
        console.log(
            `${teamOneCurrentElo.player.username}'s Current Elo Score for ${game.name}': ${teamOneCurrentEloScore}`
        );
        console.log(
            `${teamTwoCurrentElo.player.username}'s Current Elo Score for ${game.name}': ${teamTwoCurrentEloScore}`
        );
        console.log(
            `\n------Just before running versusEloCalculator------\nIndex: ${i}`
        );

        const [playerOneUpdatedElo, playerTwoUpdatedElo] = versusEloCalculator(
            teamOneCurrentEloScore,
            teamTwoCurrentEloScore,
            teamOneAvgElo,
            teamTwoAvgElo,
            expectedOutcome,
            winningTeam
        );
        console.log("------Just after running versusEloCalculator------");
        console.log(
            `${teamOneCurrentElo.player.username}'s Updated Elo Score for ${game.name}: ${playerOneUpdatedElo}`
        );
        console.log(
            `${teamTwoCurrentElo.player.username}'s Updated Elo Score for ${game.name}: ${playerTwoUpdatedElo}`
        );
        // using the values we just calculated // one at a time
        winnerUpdateResult = await GameElo.findOneAndUpdate(
            {
                game: game._id,
                player: teamOneCurrentElo.player._id,
            },
            {
                game: game._id,
                player: teamOneCurrentElo.player._id,
                elo_score: playerOneUpdatedElo,
            },
            { upsert: true, new: true }
        )
            .populate("game", "name")
            .populate("player", "first_name last_name username");
        loserUpdateResult = await GameElo.findOneAndUpdate(
            {
                game: game._id,
                player: teamTwoCurrentElo.player._id,
            },
            {
                game: game._id,
                player: teamTwoCurrentElo.player._id,
                elo_score: playerTwoUpdatedElo,
            },
            { upsert: true, new: true }
        )
            .populate("game", "name")
            .populate("player", "first_name last_name username");
    }
}
