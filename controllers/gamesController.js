import mongoose from "mongoose";
import Game from "../models/gameSchema.js";
import GameSession from "../models/gameSessionSchema.js";

export const addNewGameSession = async (req, res) => {
    console.log("Attempting to add new game session");

    const { session_entered_by, game, score, players_in_session, winner } =
        req.body;

    console.log(`The request body is: ${req.body}`);
};

export const createNewGameType = async (req, res) => {
    console.log("Attempting to create a new game type");

    const { category_name, name, scoring_type } = req.body;
    console.log(req.body);
    try {
        const existingGame = await Game.findOne({ name: name });
        if (existingGame) {
            return res.status(403).json({
                //response code "forbidden", exists already.
                message:
                    "Game name already exists. Please try again with a different name.",
            });
        } else {
            //create new game record on the database
            const newGame = await Game.create({
                category_name,
                name,
                scoring_type,
            });
            res.status(201).json({ game: newGame });
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong when trying to create new game.",
        });
    }
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
