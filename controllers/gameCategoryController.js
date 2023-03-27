import mongoose from "mongoose";
import GameCategory from "../models/gameCategorySchema.js";
import Game from "../models/gameSchema.js";

export async function getAllCategories(req, res) {
    console.log(`Attempting to GET list of all Game Categories.`);
    try {
        const categoryList = await GameCategory.find()
            .populate({
                path: "games",
                model: "games_collection",
                populate: {
                    path: "game_sessions",
                    model: "game_sessions_collection",
                },
            })
            .exec();
        res.status(200).json(categoryList);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getGameCategory = async (req, res) => {
    console.log("Attempting to GET specific Game Category");
    const { _id } = req.params;
    try {
        const retrievedCategory = await GameCategory.findById(_id);
        if (!retrievedCategory) {
            return res.status(404).send(`No category found with _id: ${_id}`);
        }
        return res.status(200).json({
            message: `Found Category ${_id}`,
            response: retrievedCategory,
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
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
