import mongoose from "mongoose";
import Game from "../models/scoringTypeSchema.js";
import GameCategory from "../models/scoringTypeSchema.js";
import GameSession from "../models/scoringTypeSchema.js";

export const addNewGameSession = async (req, res) => {
    console.log("Attempting to add new game session");

    const { session_entered_by, game, score, players_in_session, winner } =
        req.body;

    console.log(`The request body is: ${req.body}`);
};
