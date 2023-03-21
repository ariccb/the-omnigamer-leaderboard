import mongoose from "mongoose";

/**
 * this will be a dynamic schema that will get a new <game-name>EloScore
 * key for each new game that is added to the games collection.
 * This is to enable there to be a leaderboard based on Elo Rating for
 * each and every game-type, and to allow those scores to be averaged amongst
 * game categories to get category leaderboards, as well as the Omni-Leaderboard....
 * which is the overall winner in the group.
 */

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    created_at: {
        type: Date,
        default: new Date(),
    },
    updated_at: {
        type: Date,
    },
    omni_score: { type: Number, default: 0 },
});

const User = mongoose.model("users", userSchema);
export default User;
