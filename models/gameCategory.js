import mongoose from "mongoose";

const gameCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    games: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Game",
        },
    ],
});

const GameCategory = mongoose.model("game-categories", gameCategorySchema);
export default GameCategory;
