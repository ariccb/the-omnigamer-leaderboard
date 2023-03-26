import mongoose from "mongoose";

/**
 * this will be a dynamic schema that will get a new <game-name>EloScore
 * key for each new game that is added to the games collection.
 * This is to enable there to be a leaderboard based on Elo Rating for
 * each and every game-type, and to allow those scores to be averaged amongst
 * game categories to get category leaderboards, as well as the Omni-Leaderboard....
 * which is the overall winner in the group.
 */
const categoryEloScore = new mongoose.Schema({
    category_name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "game_categories_collection",
    },
});

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    created_at: {
        type: Date,
        default: new Date(),
    },
    updated_at: {
        type: Date,
    },
    sessions_played: [
        // link to the User(s) that won to keep track
        {
            type: mongoose.Types.ObjectId,
            ref: "game_sessions_collection",
            required: false,
        },
    ],
    omni_elo_score: { type: Number, default: 100 }, // overall elo score between ALL GAMES
    // "pub game", "board game", "sport game", "video game
    category_elo_score: {
        type: Number,
        default: 100,
    }, // these ideally will be dynamically added when a new category is added
    elo_chess_score: { type: Number, default: 100 }, // these ideally will be dynamically added when a new game type is added
    game_sessions: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "game_sessions_collection",
        required: false,
    },
});

const User = mongoose.model("users_collection", userSchema, "users_collection");
// users_collection is the name of the collection on MongoDB
export default User;
