import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/userRouter.js";
import gameRouter from "./routes/gameRouter.js";
import seedRouter from "./routes/seedRouter.js";
// import leaderboardRouter from "./routes/leaderboards.js";
// import gameSessionRouter from "./routes/gameSessionRouter.js";

//read the MongoDB credentials from .env file
dotenv.config({
    path: "./auth/.env",
});

const connectionStr = process.env.MONGO_URL;
console.log(connectionStr);

async function main() {
    await mongoose.connect(connectionStr);
}
main().catch((err) => console.log(err));

//assigning the connection setup
export const db = await mongoose.connect(connectionStr);

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json()); // this tells our express app that we expect to be receiving json values.
//---- example json value being passed with curl as a post request:
// curl -d '{"a":"hello","b":"bye"}
// app.use(express.urlencoded() // another option to tell express app that we expect to be receiving url encoded values.(which usually come from online forms)
//---- example urlencoded value being passed with curl as a post request:
// curl =d "param1=value1&param2=value2" -X POST http://localhost:4444/aaa\?foo\=bar\&fred\=barney

app.get("/", (req, res) => {
    res.send("You reached the home endpoint.\n");
});

// list of the routers i'm using
app.use("/users", userRouter); // all the functionality to do with users
app.use("/game-data", gameRouter);
app.use("/seed", seedRouter);
// app.use("/leaderboards", leaderboardRouter);
// app.use("/game/sessions", gameSessionRouter);

//port the server is listening on
app.listen(PORT, () => {
    console.log(`The server is up and running on PORT: ${PORT}\n`);
    console.log(
        `Click here to view the main endpoint: http://localhost:${PORT}`
    );
});
