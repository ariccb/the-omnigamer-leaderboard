import mongoose from "mongoose";
import Game from "../models/gameSchema.js";
import GameCategory from "../models/gameCategorySchema.js";
import GameSession from "../models/gameSessionSchema.js";
const isValidId = mongoose.Types.ObjectId.isValid;

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
