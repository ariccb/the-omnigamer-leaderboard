/**
game category: for example: "pub game", "board game", "sport game", "video game"
having a game category will help me make leaderboards for all similar game types within a category
*/

import mongoose from "mongoose";

const gameCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    games: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "games_collection", // this needs to reference the DB COLLECTION name, not the model name.
            required: false,
            unique: true,
        },
    ],
});

const GameCategory = mongoose.model(
    "game_categories_collection",
    gameCategorySchema,
    "game_categories_collection"
); //game-categories is the name of the collection on MongoDB
export default GameCategory;
