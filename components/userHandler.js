import express from "express";
import { deleteUser, updateUser, addUser, getAllUsers } from "./userData.js";

export const userHandler = express.Router();

userHandler.get("/", (req, res) => {
   res.send(getAllUsers());
});

userHandler.post("/", (req, res) => {
   const newUser = req.body;
   addUser(newUser);

   res.send(getAllUsers());
});

userHandler.patch("/:id", (req, res) => {
   const name = req.params.id;
   const update = req.body;
   updateUser(name, update);

   res.send(getAllUsers());
});

userHandler.delete("/:id", (req, res) => {
   const userToDelete = req.params.id;
   deleteUser(userToDelete);

   res.send(getAllUsers());
});
