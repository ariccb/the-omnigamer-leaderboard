import express from "express";
import mongoose from "mongoose";
import Game from "./scoringTypeSchema";

/**
 *"chess", GameSession: Ron(b) vs Jeff(w) on 2023/02/13 @ 11am
 *
 *
 *
 **/
const gameSessionSchema = new mongoose.Schema({
    session_entered_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    game_id: {
        type: Number,
        required: true,
    },
    // example: versus(chess, outcomes could be win/lose/draw), High Score(scrabble), Low Score(golf),
    // Lowest Time Score(racing), Highest Time Score (survival),
    scoring_type: {
        type: String,
        enum: [
            // lets you have pre-determined options
            "versus",
            "high-score",
            "low-score",
            "lowest-time-score",
            "highest-time-score",
        ],
        default: "High Score",
    },
    win_loss_draw_result: {
        type: String,
        enum: ["Win", "Lose", "Draw"],
        required: false,
    },
    time_result: { type: Number, required: false },
    score_result: { type: Number, required: false },
    players_in_session: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    ],
    winners: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
        },
    ],
});

const GameSession = mongoose.model("game-sessions", gameSessionSchema);
export default GameSession;
