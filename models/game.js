import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GameCategory",
        required: true,
    },
    scoring_sessions: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "GameSession",
        },
    ],
    win_or_lose_based: { type: Boolean, required: true },
    high_score_based: { type: Boolean, required: true },
});

const Game = mongoose.model("games", gameSchema);
export default Game;
