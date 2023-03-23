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
    players_won_result: [
        // link to the User(s) that won to keep track
        {
            type: mongoose.Types.ObjectId,
            ref: "users_collection",
            required: false,
        },
    ],
    players_lost_result: [
        // link to the User(s) that lost to keep track
        {
            type: mongoose.Types.ObjectId,
            ref: "users_collection",
            required: false,
        },
    ],
    players_tied_result: [
        // link to the Users that tied to keep track
        {
            type: mongoose.Types.ObjectId,
            ref: "users_collection",
            required: false,
        },
    ],
    time_score_result: { type: Number, required: false },
    high_low_score_result: { type: Number, required: false },
});
/** can I add time_result and score_result based on game picked?
gameSessionSchema.pre('save', async function() {

    await doStuff();
    await doMoreStuff();
  });
 **/
const GameSession = mongoose.model(
    "game_sessions_collection",
    gameSessionSchema,
    "game_sessions_collection"
); // game_sessions_collection is the name of the collection on MongoDB

export default GameSession;
