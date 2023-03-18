import { db } from "../index.js";

const gameSchema = new db.Schema({
    id: { type: String },
    name: { type: String, required: true },
    category: { type: String, required: true },
    scoring_sessions: { type: ScoringSession, required: false },
    number_of_players: { type: Boolean, required: true },
});

const gameModel = db.model("games", gameSchema);
export default gameModel;
