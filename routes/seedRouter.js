import express from "express";
import User from "../models/userSchema.js";
import Game from "../models/gameSchema.js";
import GameCategory from "../models/gameCategorySchema.js";
import GameSession from "../models/gameSessionSchema.js";
import mongoose from "mongoose";
const toId = mongoose.Types.ObjectId;

const seedRouter = express.Router();

// route to this whole endpoint is "/seed"
seedRouter.get("/users", async (req, res) => {
    //PORT/seed/users
    console.log(`Attempting to seed new users`);

    const userSeed = [
        {
            first_name: "Zack",
            last_name: "Spring Chief",
            username: "BlackfootBigfoot",
            email: "zacksemail@gmail.com",
            created_at: new Date().toISOString(),
        },

        {
            first_name: "Kennan",
            last_name: "Bouwers",
            username: "autieKK",
            email: "kennan@gmail.com",
            created_at: new Date().toISOString(),
        },
        {
            first_name: "Aric",
            last_name: "Crosson Bouwers",
            username: "Dutchnesss",
            email: "aricbouwers@gmail.com",
            created_at: new Date().toISOString(),
        },
        {
            first_name: "Deng",
            last_name: "Benjamin",
            username: "anotherdeng",
            email: "dengsemail@gmail.com",
            created_at: new Date().toISOString(),
        },
        {
            first_name: "Zee",
            last_name: "Mafaiti",
            username: "JayZee",
            email: "zees@gmail.com",
            created_at: new Date().toISOString(),
        },
        {
            first_name: "Luke",
            last_name: "Pitchford",
            username: "TheEnforcer",
            email: "lukesemail@gmail.com",
            created_at: new Date().toISOString(),
        },
    ];

    const newUsers = await User.create(userSeed);
    res.json({ newUsers });
});

seedRouter.get("/games", async (req, res) => {
    //PORT/seed/games
    console.log(`Attempting to seed new games`);

    const gamesSeed = [
        {
            category_name: "board game",
            name: "Chess",
            scoring_type: "versus",
        },
    ];

    const newGames = await Game.create(gamesSeed);
    res.json({ newGames });
});

seedRouter.get("/game_categories", async (req, res) => {
    //PORT/seed/game_categories
    console.log(`Attempting to seed game categories`);

    const gameCategoriesSeed = [
        {
            name: "board games",
            game_sessions: await GameSession.populate(),
        },
    ];

    const newGames = await GameCategory.create(gameCategoriesSeed);
    res.json({ newGames });
});

export default seedRouter;
