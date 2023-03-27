import mongoose from "mongoose";
import Game from "../models/gameSchema.js";
import GameSession from "../models/gameSessionSchema.js";
import GameCategory from "../models/gameCategorySchema.js";
import User from "../models/userSchema.js";
import PlayerElo from "../models/playerEloSchema.js";
import { versusEloCalculator } from "../controllers/elo-updaters/eloScoreUpdater.js";

export const addNewGameSession = async (req, res) => {
    console.log("Attempting to add new game session");
    const {
        game_id,
        player_won,
        player_lost,
        player_tied,
        lowest_time_score,
        highest_time_score,
        high_score,
        low_score,
    } = req.body;

    try {
        const gameObj = await Game.findById(game_id);
        const playerWonObj = await User.findOne({ _id: player_won });
        const playerLostObj = await User.findOne({ _id: player_lost });
        const playerTiedObj = await User.findOne({ _id: player_tied });
        console.log(`gameObj: ${gameObj}`);
        console.log(`playersWonObj: ${playerWonObj}`);
        console.log(`playersLostObj: ${playerLostObj}`);
        console.log(`playersTiedOjb: ${playerTiedObj}`);
        const newGameSession = await GameSession.create({
            game: gameObj._id,
            date_recorded: new Date().toISOString(),
            player_won: playerWonObj._id,
            player_lost: playerLostObj._id,
            player_tied: player_tied ? playerTiedObj._id : null,
            lowest_time_score: lowest_time_score,
            highest_time_score: highest_time_score,
            high_score: high_score,
            low_score: low_score,
        });

        /**
         * do processing for collecting, and then calculating user's elo scores based
         * on game_id ("and scoring type") here.
         **/
        console.log(playerWonObj);
        const winnerEloDoc = await PlayerElo.findOneAndUpdate(
            {
                game: gameObj._id,
                player: playerWonObj._id,
            },
            {
                game: gameObj._id,
                player: playerWonObj._id,
                elo_score: 100,
            },
            { upsert: true, new: true }
        )
            .populate("game", "name")
            .populate("player", "first_name last_name username");
        console.log(`winnerEloDoc: ${winnerEloDoc}`);
        let winnerElo = winnerEloDoc.elo_score;
        console.log(`Current Elo Score of winner: ${winnerElo}`);

        const scoringType = gameObj.scoring_type;
        if (scoringType === "versus") {
            // versusEloCalculator(playersWonObj);
        }
        console.log(`Scoring_type: ${scoringType}`);
        //get 'scoring_type' from the game that was just played - this determines how the scores will be calculated.
        //check if user has an elo record for that game type yet - collect scores for player_won and player_lost
        //calculate elo - for each player

        //then send the new information as an update to the Elo record - or create
        //one using PlayerElo.findOneAndUpdate(conditions(in object form), update(in object form), {upsert: true, new: true}))

        /**
         * do processing for saving the elo scores to a new record on the game_elo_collection db here
         * **/
        res.status(201).json({
            message: `Successfully created new session record:`,
            winnerEloDoc: winnerEloDoc,
            // result: newGameSession.populate({
            //     path: "game",
            //     model: Game.base,
            //     populate: { path: "category", model: GameCategory.base },
            // }),
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong when trying to add a new session",
        });
    }
};
