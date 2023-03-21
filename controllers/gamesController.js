import mongoose from "mongoose";
import Game from "../models/scoringTypeSchema.js";
import GameCategory from "../models/scoringTypeSchema.js";
import GameSession from "../models/scoringTypeSchema.js";

export const addNewGameSession = async (req, res) => {
    console.log("Attempting to add new game session");

    const { session_entered_by, game, score, players_in_session, winner } =
        req.body;

    console.log(`The request body is: ${req.body}`);
};

// Chris's example for how to assign the highscore for a game.
// foo.forEach((game) => { //for each game session in a list of game sessions
//     bestScore[game.gameSession] = bestScore[game.gameSession] || { medal: 0 };  //making sure there is at least one thing to check against. If no score has been set yet, then medals:0
//     bestScore[game.gameSession].medal = // assign the new medal(highscore) if....
//         bestScore[game.game].medal < game.medal  // ...
//             ? game.medal
//             : bestScore[game.game].medal;
// });

// https://www.npmjs.com/package/mongoose-dynamic-schemas - package that lets you add fields to
// existing schemas dynamically
