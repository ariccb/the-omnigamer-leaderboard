import express from "express";
import {
    getOverallLeaderboard,
    getCategoryLeaderboard,
    getGameLeaderboard,
} from "../controllers/leaderboardsController.js";

const leaderboardRouter = express.Router();

gameRouter.get("/", getOverallLeaderboard); // get the overall leaderboard
gameRouter.get("/category/:_id", getCategoryLeaderboard);
gameRouter.get("/game/:_id", getGameLeaderboard);

export default leaderboardRouter;
