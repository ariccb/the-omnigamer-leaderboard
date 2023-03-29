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
        team_one,
        team_two,
        winning_team,
        lowest_time_score,
        highest_time_score,
        high_score,
        low_score,
    } = req.body;

    try {
        console.log("------ Game Session Start ------\n");
        const game = await Game.findById(game_id);
        const teamOne = await User.find({ _id: team_one });
        const teamTwo = await User.find({ _id: team_two });

        console.log(`Game Played: ${game.name}`);
        const scoringType = game.scoring_type;
        console.log(`Scoring_type: ${scoringType}\n`);

        console.log(`Team One: ${teamOne.map((player) => player.username)}`);
        console.log(`Team Two: ${teamTwo.map((player) => player.username)}`);

        const newGameSession = await GameSession.create({
            game: game._id,
            date_recorded: new Date().toISOString(),
            team_one: teamOne.map((player) => player._id), // team_one will be an array of _id's - map() always makes an array
            team_two: teamTwo.map((player) => player._id), // team_two will be an array of _id's
            winning_team: winning_team,
            lowest_time_score: lowest_time_score,
            highest_time_score: highest_time_score,
            high_score: high_score,
            low_score: low_score,
        });
        // do processing for collecting, and then calculating user's elo scores based
        // on game_id ("and scoring type") here.

        if (scoringType === "versus") {
            let eloResult = await versusEloHandler(
                game,
                teamOne,
                teamTwo,
                winning_team //1 if team 1 won, 2 if team 2 won, 0.5 if it's a tie
            );

            //idea -- could do a number-based winner method for larger teams. 1/n of players + n of players.
            // the fraction would indicate which team one, for example in a 4 player game if team 1 won, it would be 4.25(4-1/4)
            // in a 6 player game, and the 4th team won, it would be 6.666667 (6-4/6)
        }
        // if (scoringType === "high-score") { //for single-player highscore-type games, only playersWon is used
        //     versusEloHandler(gameObj, playersWon);
        // }
        res.status(201).json({
            message: `Successfully created new session record:`,
            newSession: newGameSession,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong when trying to add a new session",
        });
    }
};
