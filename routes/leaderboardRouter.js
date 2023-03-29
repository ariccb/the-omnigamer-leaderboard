import express from "express";
import {
    getGameLeaderboard,
    getCategoryLeaderboard,
} from "../controllers/leaderboardController.js";

const leaderboardRouter = express.Router();

// leaderboardRouter.get("/", getOverallLeaderboard); // get the overall leaderboard
leaderboardRouter.get("/category/:_id", getCategoryLeaderboard);
leaderboardRouter.get("/game/:_id", getGameLeaderboard);

export default leaderboardRouter;
