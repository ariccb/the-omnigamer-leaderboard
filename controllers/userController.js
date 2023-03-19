import UserModel from "../models/user.js";
import mongoose, { Error } from "mongoose";

export async function getUsers(req, res) {
    console.log(`Attempting to GET list of all users.`);

    try {
        const userList = await UserModel.find();
        res.status(200).json(userList);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getUser = async (req, res) => {
    console.log("Attempting to GET specific user");
    const { _id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send(`No user found with _id: ${_id}`);
    }
    try {
        const retrievedUser = await UserModel.findById(_id);
        return res.status(200).json({
            message: `Found user ${_id}`,
            response: retrievedUser,
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export async function createUser(req, res) {
    console.log(`Attempting to create new user`);

    const { email, username, first_name, last_name } = req.body;

    console.log(`Request body: ${req.body}`);
    try {
        const existingUser = await UserModel.findOne({ email: email });
        if (existingUser) {
            return res.status(403).json({
                message:
                    "User already exists. Please try again with a different username",
            }); //forbidden - user exists already
        } else {
            //create new user if they don't have a login already
            const newUser = await UserModel.create({
                email,
                username,
                first_name,
                last_name,
                created_at: new Date().toISOString(),
            });
            res.status(201).json({ user: newUser });
            // save() to the mongo db using mongoose
        }
    } catch (error) {
        res.status(500).json({
            message: "Something went wrong when trying to create new user.",
        });
    }
}

export async function updateUser(req, res) {
    console.log(`Trying to update a user.`);
    const { _id } = req.params;
    const { email, username, first_name, last_name, created_at } = req.body;

    console.log(`Attempting to update user with _id: ${_id}`);

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send(`No user found with _id: ${_id}`);
    }
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            _id,
            {
                email,
                username,
                first_name,
                last_name,
                created_at,
                updated_at: new Date().toISOString(),
                _id,
            },
            {
                new: true, // I believe if this doesn't find an existing user to update, it creates a new one
            }
        );
        res.json({
            message: `Updated user (id:${_id}).`,
            response: updatedUser,
        });
    } catch (error) {
        res.json({
            message: `Something went wrong when trying to update the user with _id: ${_id}`,
        });
    }
}

export async function patchUser(req, res) {
    console.log(`Trying to patch a user.`);
    const { _id } = req.params;
    const userPatch = req.body;

    console.log(`Attempting to update user with _id: ${_id}`);

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send(`No user found with _id: ${_id}`);
    }
    try {
        console.log("attempting patch user");
        const updatedUser = await UserModel.findByIdAndUpdate(_id, {
            ...userPatch,
            updated_at: new Date().toISOString(),
        });
        res.json({
            message: `Updated user (id:${_id}).`,
        });
    } catch (error) {
        res.json({
            message: `Something went wrong when trying to patch the user with _id: ${_id}`,
        });
    }
}
export async function deleteUser(req, res) {
    console.log("Trying to delete a user");
    const { _id } = req.params;

    console.log(`Attempting to delete user with _id: ${_id}`);

    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).send(`No user found with _id: ${_id}`);
    }
    try {
        const result = await UserModel.findByIdAndDelete(_id);
        res.json({
            message: "Deleted user",
            result: result,
        });
    } catch (err) {
        console.log(err);
    }
}
