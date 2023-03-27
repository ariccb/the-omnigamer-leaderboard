import mongoose, { model } from "mongoose";
import Game from "../models/gameSchema.js";
import GameCategory from "../models/gameCategorySchema.js";
import GameSession from "../models/gameSessionSchema.js";

export async function getAllGames(req, res) {
    console.log(`Attempting to GET list of all Games.`);
    try {
        const gameList = await Game.find()
            .populate({
                path: "category",
                select: "name",
                model: "game_categories_collection",
            })
            .populate({
                path: "game_sessions",
                model: "game_sessions_collection",
            })
            .exec();
        res.status(200).json(gameList);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getGame = async (req, res) => {
    console.log("Attempting to GET specific Game");
    const { game_id } = req.params;
    try {
        const retrievedGame = await Game.findById(game_id);
        if (!retrievedGame) {
            return res
                .status(404)
                .send(`No game found with game_id: ${game_id}`);
        }
        return res.status(200).json({
            message: `Found Game ${game_id}`,
            response: retrievedGame,
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createNewGameType = async (req, res) => {
    console.log("Attempting to create a new game type");

    const { name, category, scoring_type } = req.body;

    try {
        console.log(`Trying to get game category from Id:${category}`);
        const categoryObj = await GameCategory.findOne({ _id: category });
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
            const gameObj = await Game.create({
                name,
                scoring_type,
                category: categoryObj._id,
            });
            await gameObj.save();
            await categoryObj.games.push(gameObj);
            await categoryObj.save();
            res.status(201).json({ game: gameObj });
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
        const categoryObj = await GameCategory.findOne({ _id: category });
        const gameObj = await Game.findOne({ _id: game_id });
        const updatedGameObj = await Game.updateOne(
            { _id: game_id },
            {
                name: name,
                category: categoryObj,
                scoring_type: scoring_type,
            }
        );
        res.json({
            message: `Updated (${gameObj.name}).`,
            result: await Game.findById(game_id).populate("category", "name"),
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

export async function deleteGame(req, res) {
    console.log("Trying to delete a game");
    const { game_id } = req.params;

    console.log(`Attempting to delete game with game_id: ${game_id}`);

    try {
        const result = await Game.findByIdAndDelete(game_id);
        res.json({
            message: "Deleted game",
            result: result,
        });
    } catch (err) {
        console.log(err);
        return res
            .status(400)
            .send(
                `There was an error trying to delete the game with game_id: ${game_id}. Are you suse that game exists?`
            );
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
