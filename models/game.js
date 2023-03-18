import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: String, required: true },
    scoring_sessions: { type: ScoringSession, required: false },
    number_of_players: { type: Boolean, required: true },
});

const gameModel = mongoose.model("games", gameSchema);
export default gameModel;
