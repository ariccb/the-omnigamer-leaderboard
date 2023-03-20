import express from "express";
import {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    patchUser,
    deleteUser,
} from "../controllers/userController.js";

const userRouter = express.Router();

// route to this whole endpoint is "/users"
userRouter.get("/", getAllUsers);
userRouter.get("/:_id", getUser);
userRouter.post("/", createUser);
userRouter.put("/:_id", updateUser); //needs to send the whole body object
userRouter.patch("/:_id", patchUser); // update just the properties you send in the request body
userRouter.delete("/:_id", deleteUser);

export default userRouter;
