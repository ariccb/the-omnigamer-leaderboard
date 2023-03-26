import mongoose from "mongoose";
import Game from "../models/gameSchema.js";
import GameSession from "../models/gameSessionSchema.js";
import GameCategory from "../models/gameCategorySchema.js";
import User from "../models/userSchema.js";

export const addNewGameSession = async (req, res) => {
    console.log("Attempting to add new game session");
    const {
        game_id,
        players_won,
        players_lost,
        players_tied,
        lowest_time_score,
        highest_time_score,
        high_score,
        low_score,
    } = req.body;

    try {
        console.log("Trying to add a new session");
        const newGameSession = await GameSession.create({
            game: await Game.findById(game_id),
            date_recorded: new Date().toISOString(),
            players_won: await User.find({ _id: players_won }),
            players_lost: await User.find({ _id: players_lost }),
            players_tied: await User.find({ _id: players_tied }),
            lowest_time_score: lowest_time_score,
            highest_time_score: highest_time_score,
            high_score: high_score,
            low_score: low_score,
        });
        const newSessionId = newGameSession._id;
        console.log(newSessionId);

        /**
         * do processing for collecting, and then calculating user's elo scores based
         * on game_id ("and scoring type") here.
         **/

        /**
         * do processing for saving the elo scores to a new record on the game_elo_collection db here
         * **/
        res.status(201).json({
            message: `Successfully created new session record:`,
            result: await GameSession.findOne({ _id: newSessionId }).populate({
                path: "game",
                model: "games_collection",
                populate: {
                    path: "category",
                    model: "game_categories_collection",
                },
            }),
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
