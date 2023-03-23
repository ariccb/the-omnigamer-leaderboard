import mongoose from "mongoose";
import Game from "../models/gameSchema.js";
import GameCategory from "../models/gameCategorySchema.js";
import GameSession from "../models/gameSessionSchema.js";
const isValidId = mongoose.Types.ObjectId.isValid;

export const addNewGameSession = async (req, res) => {
    console.log("Attempting to add new game session");
    const { _id } = req.params; //you are passing in the _id of the game you played

    const {
        players_won_result,
        players_lost_result,
        players_tied_result,
        time_score_result,
        high_low_score_result,
    } = req.body;
    // GameSession.create({
    //     game: toId(_id),
    // });
    console.log(`The request body is: ${req.body}`);
};
