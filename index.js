import express from "express";
import { userHandler } from "./components/userHandler.js";

const app = express();
const PORT = 8000;

app.use(express.json());

app.get("/", (req, res) => {
   res.send("You reached the home endpoint.\n");
});

app.use("/users", userHandler); // router to users endpoint
// app.use("/leaderboard", leaderboardHandler); // router to leaderboard endpoint

//port the server is listening on
app.listen(PORT, () => {
   console.log(`The server is up and running on PORT: ${PORT}\n`);
   console.log(
      `Click here to view the main endpoint: http://localhost:${PORT}`
   );
});
