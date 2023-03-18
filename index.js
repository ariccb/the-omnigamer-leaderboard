import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/users.js";

dotenv.config({
    path: "./auth/.env",
});

const connectionStr = process.env.MONGO_URL;
console.log(connectionStr);
export const db = await mongoose.connect(connectionStr);

// need to move this into models/games.js
const gameSchema = new mongoose.Schema({
    listOfUsers: String,
    email: String,
});

const app = express();
const PORT = 8000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("You reached the home endpoint.\n");
});

app.use("/users", userRouter);
//app.use("/games", gamesRoute);

//port the server is listening on
app.listen(PORT, () => {
    console.log(`The server is up and running on PORT: ${PORT}\n`);
    console.log(
        `Click here to view the main endpoint: http://localhost:${PORT}`
    );
});
