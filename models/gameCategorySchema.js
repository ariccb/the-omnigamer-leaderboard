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
    game_sessions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "game_sessions_collection", // i believe this needs to reference the DB COLLECTION name, not the model name. If that doesn't work try the model name
            required: false,
        },
    ],
});

const GameCategory = mongoose.model(
    "game_categories_collection",
    gameCategorySchema,
    "game_categories_collection"
); //game-categories is the name of the collection on MongoDB
export default GameCategory;
