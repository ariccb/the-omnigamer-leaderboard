import GameElo from "../../models/gameEloSchema.js";
import { versusEloCalculator } from "../elo-calculators/versusEloScoreCalculator.js";

export async function versusEloHandler(
    game,
    playersWon,
    playersLost,
    playersTied
) {
    // just get the _id's from the winners, losers and drawers arrays and assign them to an array
    const winnerIds = playersWon.map((player) => player._id); // players_won will be an array of _id's - map() always makes an array
    const loserIds = playersLost.map((player) => player._id); // players_lost will be an array of _id's
    const drawerIds = playersTied.map((player) => player._id); // players_tied will be an array of _id's
    //do a specific ELO calculation if the game type is a 1v1 situation

    // if there is a whole team playing, get the elo score of the collective team that won - otherwise the sum of 1 winner(no team) will be itself
    let winnersEloSum = 0;
    const winnerElos = await Promise.all(
        // need to get the GameElo records of each player on the team first, since it's not recommended to have async functions in a ForEach
        playersWon.map(async (player) => {
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
    winnerElos.forEach((player) => {
        // need to get the GameElo records of each player on the team first, since it's not recommended to have async functions in a ForEach
        winnersEloSum += player.elo_score;
    });
    console.log(`winnersEloSum: ${winnersEloSum}`);
    const winnersAvgElo = winnersEloSum / winnerIds.length;
    console.log(`winnersAvgElo: ${winnersAvgElo}`);

    // if there is a whole team playing, get the elo score of the collective team that lost - otherwise the sum of 1 loser(no team) will be itself
    let losersEloSum = 0;
    const loserElos = await Promise.all(
        playersWon.map(async (player) => {
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
    loserElos.forEach((player) => {
        losersEloSum += player.elo_score;
    });
    console.log(`losersEloSum: ${losersEloSum}`);
    const losersAvgElo = losersEloSum / loserIds.length;
    console.log(`losersAvgElo: ${losersAvgElo}`);

    // this is another way of writing the forEach((player) => {losersEloSum += player.elo_score}) part:
    // let x = playersWon.reduce(((sumSoFar, player ) => {return player.elo_score + sumSoFar} ),0)
    // console.log(x)
    // console.log(winnersEloSum)

    // if the the user with higher elo won = 1, if the user with high elo lost = 0, if there is a draw, = 0.5
    let expectedOutcome;
    if (playersTied.length > 0) {
        expectedOutcome = 0.5; // if there are players in the playersTied array, expectedOutcome = 0.5
    } else if (winnersEloSum >= losersEloSum) {
        expectedOutcome = 1; // if the players with higher elo wins, then expectedOutcome = 1, otherwise = 0
    } else {
        expectedOutcome = 0;
    }

    console.log(
        `\nexpectedOutcome: ${expectedOutcome}\n(1 when the higher-elo team won, 0 when the higher-elo team lost, 0.5 for a tie)`
    );
    let winnerUpdateResult;
    let loserUpdateResult;
    if (expectedOutcome === 1) {
        // when the higher elo team wins
        // calculate what the elo scores should be updated to for each winner -- then do losers below
        // do one user's elo calculation at a time
        // .... what do I do if it doesn't find one?

        winnerIds.forEach(async (winner, index) => {
            let winnerCurrentElo = await GameElo.findOneAndUpdate(
                {
                    game: game._id,
                    player: winner._id,
                },
                {
                    game: game._id,
                    player: winner._id,
                },
                { upsert: true, new: true }
            ).populate("player", "username");
            console.log(
                `\n${index} time through... winnerCurrentElo: ${winnerCurrentElo}`
            );

            let loserCurrentElo = await GameElo.findOneAndUpdate(
                {
                    game: game._id,
                    player: loserIds[index]._id,
                },
                {
                    game: game._id,
                    player: loserIds[index]._id,
                },
                { upsert: true, new: true }
            ).populate("player", "username");
            console.log(
                `\n${index} time through... loserCurrentElo: ${loserCurrentElo}`
            );
            let winnerCurrentEloScore = winnerCurrentElo.elo_score;
            let loserCurrentEloScore = loserCurrentElo.elo_score;
            console.log(
                `${winnerCurrentElo.player.username}'s Current Elo Score for ${game.name}': ${winnerCurrentEloScore}`
            );
            console.log(
                `${loserCurrentElo.player.username}'s Current Elo Score for ${game.name}': ${loserCurrentEloScore}`
            );
            // put this inside a loop
            console.log("------Just before running versusEloCalculator------");
            const [playerOneUpdatedElo, playerTwoUpdatedElo] =
                versusEloCalculator(
                    winnerCurrentEloScore,
                    loserCurrentEloScore,
                    winnersAvgElo,
                    losersAvgElo,
                    expectedOutcome
                );
            console.log("------Just after running versusEloCalculator------");
            console.log(
                `${winnerCurrentElo.player.username}'s Updated Elo Score for ${game.name}': ${playerOneUpdatedElo}`
            );
            console.log(
                `${loserCurrentElo.player.username}'s Updated Elo Score for ${game.name}': ${playerTwoUpdatedElo}`
            );
            // using the values we just calculated // one at a time
            console.log(
                `Trying to update the record of the winner with the new Elo Score.`
            );
            winnerUpdateResult = await GameElo.findOneAndUpdate(
                {
                    game: game._id,
                    player: winner._id,
                },
                {
                    game: game._id,
                    player: winner._id,
                    elo_score: playerOneUpdatedElo,
                },
                { upsert: true, new: true }
            )
                .populate("game", "name")
                .populate("player", "first_name last_name username");

            console.log(
                `Trying to update the record of the loser with the new Elo Score.`
            );
            loserUpdateResult = await GameElo.findOneAndUpdate(
                {
                    game: game._id,
                    player: loserIds[index]._id,
                },
                {
                    game: game._id,
                    player: loserIds[index]._id,
                    elo_score: playerTwoUpdatedElo,
                },
                { upsert: true, new: true }
            )
                .populate("game", "name")
                .populate("player", "first_name last_name username");
        });
        console.log(winnerUpdateResult, loserUpdateResult);
    } else if (expectedOutcome === 0) {
        console.log("need to do logic for expectedOutcome === 0 still");
    } else if (expectedOutcome === 0.5) {
        console.log("need to do logic for expectedOutcome === 0.5 still");
    }
}
