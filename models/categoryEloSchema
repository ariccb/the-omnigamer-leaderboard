import mongoose from "mongoose";

const categoryEloSchema = new mongoose.Schema({
    category: {
        // adds the game to a specific category
        type: mongoose.Schema.Types.ObjectId,
        ref: "game_categories_collection",
        required: true,
    },
    player: {
        // adds the game to a specific category
        type: mongoose.Schema.Types.ObjectId,
        ref: "users_collection",
        required: true,
    },
    elo_score: { type: Number, required: true, default: 1000 },
});

const CategoryElo = mongoose.model(
    "category_elo_collection",
    categoryEloSchema,
    "category_elo_collection"
); //games_collection is the name of the collection on MongoDB
export default CategoryElo;
