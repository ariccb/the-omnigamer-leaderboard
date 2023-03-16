import express from "express";
import { supabase } from "../supabase.js";
import { deleteUser, updateUser, addUser, getAllUsers } from "./userData.js"; // this won't be needed if switching to supabase

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

const { data, error } = await supabase
   .from("profiles")
   .insert([{ username: "ariccb", full_name: "Aric Crosson Bouwers" }]);

console.log(data);
if (error) {
   console.log(error);
}
