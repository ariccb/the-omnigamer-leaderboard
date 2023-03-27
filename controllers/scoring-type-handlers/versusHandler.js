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

    console.log(
        `winnerIds:${winnerIds}, loserIds:${loserIds}, drawerIds:${drawerIds}`
    );
    // if there is a whole team playing, get the elo score of the collective team that won - otherwise the sum of 1 winner(no team) will be itself
    let winnersEloSum = 0;
    const winnerElos = await Promise.all(
        // need to get the GameElo records of each player on the team first, since it's not recommended to have async functions in a ForEach
        playersWon.map(async (player) => {
            return await GameElo.findOne({
                player: player._id,
                game: game._id,
            });
        })
    );
    console.log(winnerElos);
    winnerElos.forEach((player) => {
        // need to get the GameElo records of each player on the team first, since it's not recommended to have async functions in a ForEach
        winnersEloSum += player.elo_score;
    });
    console.log(winnersEloSum);
    const winnersAvgElo = winnersEloSum / winnerIds.length;

    // if there is a whole team playing, get the elo score of the collective team that lost - otherwise the sum of 1 loser(no team) will be itself
    let losersEloSum = 0;
    const loserElos = await Promise.all(
        playersWon.map(async (player) => {
            return await GameElo.findOne({
                player: player._id,
                game: game._id,
            });
        })
    );
    console.log(loserElos);
    loserElos.forEach((player) => {
        losersEloSum += player.elo_score;
    });
    console.log(losersEloSum);
    const losersAvgElo = losersEloSum / loserIds.length;

    // let x = playersWon.reduce(((sumSoFar, player ) => {return player.elo_score + sumSoFar} ),0)
    // console.log(x)
    // console.log(winnersEloSum)

    // if the the user with higher elo won = 1, if the user with high elo lost = 0, if there is a draw, = 0.5
    let expectedOutcome;
    if (playersTied.length > 0) {
        expectedOutcome = 0.5; // if there are players in the playersTied array, expectedOutcome = 0.5
    } else if (winnersEloSum > losersEloSum) {
        expectedOutcome = 1; // if the players with higher elo wins, then expectedOutcome = 1, otherwise = 0
    } else {
        expectedOutcome = 0;
    }

    console.log(
        `expectedOutcome: ${expectedOutcome}\n(1 when the higher-elo team won, 0 when the higher-elo team lost, 0.5 for a tie)`
    );
    if (expectedOutcome === 1) {
        // when the higher elo team wins
        // calculate what the elo scores should be updated to for each winner -- then do losers below
        // do one user's elo calculation at a time
        winnerIds.forEach(async (winner, index) => {
            let winnerCurrentElo = await GameElo.findOne({
                game: game._id,
                player: winner._id,
            });
            let loserCurrentElo = await GameElo.findOne({
                game: game._id,
                player: loserIds[index]._id,
            });
            let winnerCurrentEloScore = winnerCurrentElo.elo_score;
            let loserCurrentEloScore = loserCurrentElo.elo_score;
            // put this inside a loop
            const { playerOneUpdatedElo, playerTwoUpdatedElo } =
                versusEloCalculator(
                    winnerCurrentEloScore,
                    loserCurrentEloScore,
                    winnersAvgElo,
                    losersAvgElo,
                    expectedOutcome
                );

            // using the values we just calculated // one at a time
            const winnerUpdateResult = await GameElo.findOneAndUpdate(
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

            const loserUpdateResult = await GameElo.findOneAndUpdate(
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

        // find and update, or create a new gameElo document to keep track of each losers' elo score for this game
        // reverse the expected result number for the winners and losers
    }
    //get 'scoring_type' from the game that was just played - this determines how the scores will be calculated.
    //check if user has an elo record for that game type yet - collect scores for players_won and players_lost
    //calculate elo - for each player

    //then send the new information as an update to the Elo record - or create
    //one using PlayerElo.findOneAndUpdate(conditions(in object form), update(in object form), {upsert: true, new: true}))

    /**
     * do processing for saving the elo scores to a new record on the game_elo_collection db here
     * **/
}
