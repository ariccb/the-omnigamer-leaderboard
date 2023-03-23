// game: for example, the name of the game, ie
// - Chess, Scrabble, Super Smash Bros, Darts, etc - irrespective of the game category

import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    category: {
        // adds the game to a specific category
        type: mongoose.Schema.Types.ObjectId,
        ref: "game_categories_collection",
        required: true,
    },
    name: {
        // the name of the game that was played, ie. chess, pinball, pingpong, etc.
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

const Game = mongoose.model("games_collection", gameSchema, "games_collection"); //games_collection is the name of the collection on MongoDB
export default Game;
