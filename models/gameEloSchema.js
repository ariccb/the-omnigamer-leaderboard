import mongoose from "mongoose";

const gameEloSchema = new mongoose.Schema({
    game: {
        // adds the game to a specific category
        type: mongoose.Schema.Types.ObjectId,
        ref: "games_collection",
        required: true,
    },
    user: {
        // adds the game to a specific category
        type: mongoose.Schema.Types.ObjectId,
        ref: "users_collection",
        required: true,
    },
    elo_score: { type: Number, required: true, default: 100 },
});

const GameElo = mongoose.model(
    "game_elo_collection",
    gameEloSchema,
    "game_elo_collection"
); //games_collection is the name of the collection on MongoDB
export default GameElo;
