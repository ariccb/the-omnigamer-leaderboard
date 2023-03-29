import mongoose from "mongoose";
import GameCategory from "../models/gameCategorySchema.js";
import GameElo from "../models/gameEloSchema.js";
import Game from "../models/gameSchema.js";

export async function getGameLeaderboard(req, res) {
    try {
        const { _id } = req.params;
        const gameDocs = await GameElo.find({ game: _id })
            .populate("player", "username first_name -_id")
            .select("username first_name elo_score -_id")
            .sort({ elo_score: "desc" })
            .exec();

        const printLeaderboard = gameDocs.reduce((final, current, id) => {
            return (
                final +
                (id + 1) +
                ". Username: " +
                current.player.username +
                " (" +
                current.player.first_name +
                ") | Elo Score: " +
                current.elo_score +
                "\n"
            );
        }, "");
        const game = await Game.findById(_id);
        const gameName = game.name;
        console.log(`----LEADERBOARD RANKINGS FOR ${gameName.toUpperCase()}----`);
        console.log(printLeaderboard);

        res.status(200).json(gameDocs);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export async function getCategoryLeaderboard(req, res) {
    try {
        const { _id } = req.params;
        const gameDocs = await GameElo.find({})
            .populate("game", "category -_id")
            .populate("player", "username first_name -_id")
            .select("username first_name elo_score -_id")
            .sort({ elo_score: "desc" })
            .exec();

        const printLeaderboard = gameDocs.reduce((final, current, id) => {
            return (
                final +
                (id + 1) +
                ". Category: " +
                current.game.category.name +
                " | Username: " +
                current.player.username +
                " (" +
                current.player.first_name +
                ") | Elo Score: " +
                current.elo_score +
                "\n"
            );
        }, "");
        const category = await GameCategory.findById(_id);
        const categoryName = category.name;
        console.log(`----LEADERBOARD RANKINGS FOR ${categoryName.toUpperCase()}----`);
        console.log(printLeaderboard);

        res.status(200).json(gameDocs);
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: error.message });
    }
}

// export async function getOverallLeaderboard(req, res) {}
// export async function getCategoryLeaderboard(req, res) {}
