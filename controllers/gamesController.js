import mongoose, { model } from "mongoose";
import Game from "../models/gameSchema.js";
import GameCategory from "../models/gameCategorySchema.js";
import GameSession from "../models/gameSessionSchema.js";
const isValidId = mongoose.Types.ObjectId.isValid;

export const createNewGameType = async (req, res) => {
    console.log("Attempting to create a new game type");

    const { name, category, scoring_type } = req.body;

    try {
        console.log(`Trying to get game category from Id:${category}`);

        const existingGame = await Game.findOne({ name: name });
        const existingGamePlural = await Game.findOne({
            name: name + "s",
        });
        if (existingGame || existingGamePlural) {
            return res.status(403).json({
                //response code "forbidden", exists already.
                message:
                    "Game name already exists. Please try again with a different name.",
            });
        } else {
            //create new game record on the database
            const newGame = await Game.create({
                name,
                scoring_type,
                category: await GameCategory.findById(category),
            });
            console.log(newGame);
            res.status(201).json({ game: newGame });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong when trying to create new game.",
        });
    }
};

export async function updateGame(req, res) {
    console.log(`Trying to update a game.`);
    const { game_id } = req.params;
    const { name, category, scoring_type } = req.body;
    console.log(
        `Attempting to update game with _id: ${game_id} and category _id of: ${category}`
    );
    try {
        const updatedGame = await Game.updateOne(
            { _id: game_id },
            {
                name: name,
                category: new mongoose.Types.ObjectId(category),
                scoring_type: scoring_type,
            }
        );
        res.json({
            message: `Updated game (id:${game_id}).`,
            result: await Game.findById(game_id).populate("category"),
        });
        /** --this is the function that DIDN'T work. not sure why!--
            const updatedGame = await Game.findByIdAndUpdate(
            game_id,
            {
                name,
                category: await GameCategory.findById(category)._id,
                scoring_type,
            },
            {
                new: true, // I believe if this doesn't find an existing game to update, it creates a new one if set to true
            }
        ).populate("category");
        **/
    } catch (error) {
        console.log(error);
        res.json({
            message: `Something went wrong when trying to update the game with _id: ${game_id}`,
        });
    }
}

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
