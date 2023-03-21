// game: for example, the name of the game, ie
// - Chess, Scrabble, Super Smash Bros, Darts, etc - irrespective of the game category

import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    category_name: {
        type: String,
        enum: ["pub games", "board games", "sports", "video games"], // lets you have pre-determined options
        default: "board games",
    },
    medals: {
        type: String,
        enum: ["gold", "silver", "bronze", "none"],
        default: "none",
    },
    gold_medal_user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: false,
    },
    silver_medal_user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: false,
    },
    bronze_medal_user: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: false,
    },
});

const Game = mongoose.model("game-categories", gameSchema); //game-categories is the name of the collection on MongoDB
export default Game;
