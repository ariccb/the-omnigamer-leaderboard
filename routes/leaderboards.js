import express from "express";
import {
    getOverallLeaderboard,
    getCategoryLeaderboard,
    getGameLeaderboard,
} from "../controllers/gameController.js";

const gameRouter = express.Router();

gameRouter.get("/", getOverallLeaderboard); // get the overall leaderboard
gameRouter.get("/category", getCategoryLeaderboard);
gameRouter.get("/game", getGameLeaderboard);
