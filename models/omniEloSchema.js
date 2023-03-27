import mongoose from "mongoose";

const omniEloSchema = new mongoose.Schema({
    player: {
        // adds the game to a specific category
        type: mongoose.Schema.Types.ObjectId,
        ref: "users_collection",
        required: true,
    },
    elo_score: { type: Number, required: true, default: 1000 },
});

const OmniElo = mongoose.model(
    "omni_elo_collection",
    omniEloSchema,
    "omni_elo_collection"
); //games_collection is the name of the collection on MongoDB
export default OmniElo;
