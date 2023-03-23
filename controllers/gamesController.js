import mongoose from "mongoose";
import Game from "../models/gameSchema.js";
import GameCategory from "../models/gameCategorySchema.js";
import GameSession from "../models/gameSessionSchema.js";
const isValidId = mongoose.Types.ObjectId.isValid;
const toId = mongoose.Types.ObjectId;

export const addNewGameSession = async (req, res) => {
    console.log("Attempting to add new game session");
    const { _id } = req.params; //you are passing in the _id of the game you played

    const {
        players_won_result,
        players_lost_result,
        players_tied_result,
        time_score_result,
        high_low_score_result,
    } = req.body;
    // GameSession.create({
    //     game: toId(_id),
    // });
    console.log(`The request body is: ${req.body}`);
};

export const createNewGameType = async (req, res) => {
    console.log("Attempting to create a new game type");
    const { _id } = req.params;
    console.log(_id);
    const { name, scoring_type } = req.body;
    console.log("the request body that was sent:");
    console.log({ body: req.body, category_id: _id });
    if (!isValidId(_id)) {
        return res.status(404).send(`No game category found with _id: ${_id}`);
    }
    try {
        console.log(`Trying to get game category from Id:${_id}`);
        const categoryObj = await GameCategory.findById(_id);
        console.log(categoryObj);

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
                category: await GameCategory.findById(_id),
            });
            res.status(201).json({ game: newGame });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Something went wrong when trying to create new game.",
        });
    }
};

export const createNewGameCategoryType = async (req, res) => {
    console.log("Attempting to create a new game category type");
    const { name } = req.body;
    console.log("the category request body that was sent:");
    console.log(req.body);

    try {
        const existingGameCategory = await GameCategory.findOne({ name: name });
        const existingGameCategoryPlural = await GameCategory.findOne({
            name: name + "s",
        });
        if (existingGameCategory || existingGameCategoryPlural) {
            return res.status(403).json({
                //response code "forbidden", exists already.
                message:
                    "Game category name already exists. Please try again with a different name.",
            });
        } else {
            //create new game record on the database
            const newGameCategory = await GameCategory.create({
                name,
            });
            res.status(201).json({ result: newGameCategory });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message:
                "Something went wrong when trying to create new game category.",
        });
    }
};

export async function updateGame(req, res) {
    console.log(`Trying to update a game.`);
    const { _id } = req.params;
    const { category_id, name, scoring_type } = req.body;
    const categoryObject = GameCategory.findById(category_id);
    console.log(`Attempting to update game with _id: ${_id}`);

    if (!isValidId(_id)) {
        return res.status(404).send(`No game found with _id: ${_id}`);
    }
    try {
        const updatedGame = await Game.findByIdAndUpdate(
            _id,
            {
                category_name: categoryObject,
                name,
                scoring_type,
            },
            {
                new: false, // I believe if this doesn't find an existing user to update, it creates a new one
            }
        );
        res.json({
            message: `Updated game (id:${_id}).`,
            response: updatedGame,
        });
    } catch (error) {
        res.json({
            message: `Something went wrong when trying to update the user with _id: ${_id}`,
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
