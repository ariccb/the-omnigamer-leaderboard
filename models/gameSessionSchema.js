import express from "express";
import mongoose from "mongoose";

/**
 * this will be a document for each an every separate game played.
 * the schema should be flexible (based on the scoring-type in the gamesSchema)
 */

const gameSessionSchema = new mongoose.Schema({
    date_recorded: { type: Date, default: new Date() },
    game: {
        // the id of the game that was played, ie. chess, pinball, pingpong, etc.
        type: mongoose.Schema.Types.ObjectId,
        ref: "games_collection",
        required: true,
    },
    // not sure how to allow multiple users to win/lose/tie
    team_one:
        // link to the User(s) on team one to keep track
        [
            {
                type: mongoose.Types.ObjectId,
                ref: "users_collection",
                required: false,
            },
        ],
    team_two:
        // link to the User(s) on team two§ keep track
        [
            {
                type: mongoose.Types.ObjectId,
                ref: "users_collection",
                required: false,
            },
        ],
    // number representation for the team that won. 0.5 for a tie
    winning_team: { type: Number, required: false },
    lowest_time_score: { type: Number, required: false },
    highest_time_score: { type: Number, required: false },
    high_score: { type: Number, required: false },
    low_score: { type: Number, required: false },
});

const GameSession = mongoose.model(
    "game_sessions_collection",
    gameSessionSchema,
    "game_sessions_collection"
); // game_sessions_collection is the name of the collection on MongoDB

export default GameSession;
