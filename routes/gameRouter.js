/** this router is for posting and getting the different
 * - games (ie,"chess", "scrabble", "ping-pong", "21-basketball")
 * - categories (ie. "board games", "bar games", "sports", "video games")
 * - sessions (ie. the individual 'round' or 'game-session' of a specific type of game)
 *
 * this route's base url is https://localhost:8000/games
 *
 * example POST body in json when creating a new game type: POST request to: https://localhost:8000/games/<insertcategoryidhere>
{
    "name": "chess",
    "scoring_type": versus" || "high-score" || "low-score" || "lowest-time-score" || "highest-time-score"
}
 * example POST body in json when creating a new game category: POST request to: https://localhost:8000/games/categories/
{
    "name": "pub game"
}

*/

import express from "express";
import {
    createNewGameType,
    updateGame,
} from "../controllers/gamesController.js";
import { createNewGameCategoryType } from "../controllers/gameCategoryController.js";
import // getOverallSessionHistory, getCategorySessionHistory, getGameSessionHistory,
"../controllers/gameSessionController.js";

const gameRouter = express.Router();

// for creating a new game type, ie: chess, ping-pong, scrabble, darts, etc.
gameRouter.post("/games", createNewGameType); // create a new game type... _id is the game category's _id
gameRouter.patch("/games/:game_id", updateGame); // update an existing game type

// for creating a new game category ie: bar games, video games, sports, board games, etc. --likely won't be used much
gameRouter.post("/categories", createNewGameCategoryType);

// for getting game sessions
// gameRouter.get("/sessions", getOverallSessionHistory); // get all sessions from all categories
// gameRouter.get("/sessions/category/:_id", getCategorySessionHistory); // get all sessions from specific category - using category's _id as the params
// gameRouter.get("/sessions/game/:_id", getGameSessionHistory); // get all sessions from specific game type - using the game's _id as the params

export default gameRouter;
