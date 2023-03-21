import express from "express";
import { createNewGameType } from "../controllers/gamesController.js";

const gameRouter = express.Router();

gameRouter.post("/", createNewGameType); // create a new game type

export default gameRouter;
