import mongoose from "mongoose";
import Game from "../models/gameSchema.js";
import GameSession from "../models/gameSessionSchema.js";
import GameCategory from "../models/gameCategorySchema.js";
import User from "../models/userSchema.js";
import GameElo from "../models/gameEloSchema.js";
import { versusEloHandler } from "./scoring-type-handlers/versusHandler.js";

export const addNewGameSession = async (req, res) => {
    const {
        game_id,
        players_won,
        players_lost,
        players_tied,
        lowest_time_score,
        highest_time_score,
        high_score,
        low_score,
    } = req.body;

    try {
        const game = await Game.findById(game_id);
        const playersWon = await User.find({ _id: players_won });
        const playersLost = await User.find({ _id: players_lost });
        const playersTied = await User.find({ _id: players_tied });

        console.log(`Game Played: ${game.name}`);
        const scoringType = game.scoring_type;
        console.log(`Scoring_type: ${scoringType}\n`);

        console.log(`Winners: ${playersWon.map((player) => player.username)}`);
        console.log(`Losers: ${playersLost.map((player) => player.username)}`);
        console.log(
            `Drawers: ${playersTied.map((player) => player.username)}\n`
        );
        const newGameSession = await GameSession.create({
            game: game._id,
            date_recorded: new Date().toISOString(),
            players_won: playersWon.map((player) => player._id), // players_won will be an array of _id's - map() always makes an array
            players_lost: playersLost.map((player) => player._id), // players_lost will be an array of _id's
            players_tied: playersTied.map((player) => player._id), // players_tied will be an array of _id's
            lowest_time_score: lowest_time_score,
            highest_time_score: highest_time_score,
            high_score: high_score,
            low_score: low_score,
        });
        // do processing for collecting, and then calculating user's elo scores based
        // on game_id ("and scoring type") here.

        let eloResult;
        if (scoringType === "versus") {
            eloResult = versusEloHandler(
                game,
                playersWon,
                playersLost,
                playersTied
            );
        }
        // if (scoringType === "high-score") { //for single-player highscore-type games, only playersWon is used
        //     versusEloHandler(gameObj, playersWon);
        // }

        res.status(201).json({
            message: `Successfully created new session record:`,
            newSession: newGameSession,
            eloResult: eloResult,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong when trying to add a new session",
        });
    }
};
