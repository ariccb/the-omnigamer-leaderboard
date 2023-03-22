// game: for example, the name of the game, ie
// - Chess, Scrabble, Super Smash Bros, Darts, etc - irrespective of the game category

import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    category_name: {
        type: String,
        enum: ["pub game", "board game", "sport game", "video game"], // lets you have pre-determined options
        default: "board game",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    scoring_type: {
        // example: versus(chess, outcomes could be win/lose/draw), High Score(scrabble), Low Score(golf),
        // Lowest Time Score(racing), Highest Time Score (survival),
        type: String,
        enum: [
            // lets you have pre-determined options
            "versus", // example, in chess, outcomes could be win/lose/draw, or sports
            "high-score",
            "low-score",
            "lowest-time-score",
            "highest-time-score",
        ],
        default: "high-score",
    },
});

const Game = mongoose.model("games", gameSchema); //game-categories is the name of the collection on MongoDB
export default Game;
