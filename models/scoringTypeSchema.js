import mongoose from "mongoose";
/**the idea here was to enable someone to be able to add a new game type
 * to the leaderboards, and be prompted for what scoring scheme that game
 * uses, so the leaderboard will know how to weight and track wins.
 *
 * This would avoid the need to have a schema for EACH game, and
 * enable a dynamic Overall Leaderboard that would include each new game
 * added
 * **/

// example: Win/Lose/Draw(chess), High Score(scrabble), Low Score(golf),
// Lowest Time Score(racing), Highest Time Score (survival),

const scoringTypeSchema = new mongoose.Schema({
    win_lose_draw_based: { type: Boolean, required: true },
    high_score_based: { type: Boolean, required: true },
    low_score_based: { type: Boolean, required: true },
    low_time_score_based: { type: Boolean, required: true },
    high_time_score_based: { type: Boolean, required: true },
});

const Game = mongoose.model("games", scoringTypeSchema);
export default Game;

// Chris's example for how to assign the highscore for a game.
// foo.forEach((game) => { //for each game session in a list of game sessions
//     bestScore[game.gameSession] = bestScore[game.gameSession] || { medal: 0 };  //making sure there is at least one thing to check against. If no score has been set yet, then medals:0
//     bestScore[game.gameSession].medal = // assign the new medal(highscore) if....
//         bestScore[game.game].medal < game.medal  // ...
//             ? game.medal
//             : bestScore[game.game].medal;
// });
