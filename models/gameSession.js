import express from "express";
import mongoose from "mongoose";
import Game from "./game";

const gameSessionSchema = new mongoose.Schema({
    // session_entered_by: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User",
    //     required: true,
    // },
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Game",
        required: true,
    },
    winner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    score: { type: Number, required: false },
    players_in_session: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    ],
    number_of_players: { type: Boolean, required: true },
});

const GameSession = mongoose.model("game-sessions", gameSessionSchema);
export default GameSession;
