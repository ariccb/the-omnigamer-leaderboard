import User from "../models/userSchema.js";
import mongoose from "mongoose";
const isValidId = mongoose.Types.ObjectId.isValid;

export async function getAllUsers(req, res) {
    console.log(`Attempting to GET list of all users.`);

    try {
        const userList = await User.find();
        res.status(200).json(userList);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getUser = async (req, res) => {
    console.log("Attempting to GET specific user");
    const { _id } = req.params;
    if (!isValidId(_id)) {
        return res.status(404).send(`No user found with _id: ${_id}`);
    }
    try {
        const retrievedUser = await User.findById(_id);
        if (retrievedUser == null) {
            return res.status(404).json({
                message: `Couldn't find a user with id: ${_id}`,
            });
        } else {
            return res.status(200).json({
                message: `Found user ${_id}`,
                response: retrievedUser,
            });
        }
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export async function createUser(req, res) {
    console.log(`Attempting to create new user`);

    const { email, username, first_name, last_name } = req.body;

    console.log(
        `Request body: \nemail:${email}\nusername:${username}\nfirst_name:${first_name}\nlast_name:${last_name}\n`
    );
    try {
        const existingUserEmail = await User.findOne({ email: email });
        const existingUserUsername = await User.findOne({ username: username });

        if (existingUserUsername) {
            return res.status(403).json({
                message:
                    "Account already exists with that username. Please try again with a different one.",
            }); //forbidden - user exists already
        } else if (existingUserEmail) {
            return res.status(403).json({
                message:
                    "Account already exists with that email. Please try again with a different one.",
            }); //forbidden - user exists already
        } else {
            //create new user if they don't have a login already
            const newUser = await User.create({
                email,
                username,
                first_name,
                last_name,
                created_at: new Date().toISOString(),
            });
            const newUserId = newUser._id;

            res.status(201).json({
                message: "Successfully added a new user.",
                result: await User.findOne({ _id: newUserId }),
            });
        }
    } catch (error) {
        console.log(error);
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
    try {
        const updatedUser = await User.findByIdAndUpdate(
            _id,
            {
                email,
                username,
                first_name,
                last_name,
                created_at,
                updated_at: new Date().toISOString(),
            },
            {
                new: true, // I believe if this doesn't find an existing user to update, it creates a new one
            }
        );
        const updatedUserId = updatedUser._id;
        res.status(200).json({
            message: "Successfully updated a new user.",
            result: await User.findOne({ _id: updatedUserId }).populate({
                path: "sessions_played",
                model: "game_sessions_collection",
                populate: {
                    path: "game",
                    model: "games_collection",
                },
            }),
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

    if (!isValidId(_id)) {
        return res.status(404).send(`No user found with _id: ${_id}`);
    }
    try {
        console.log("attempting patch user");
        await User.findByIdAndUpdate(_id, {
            ...userPatch,
            updated_at: new Date().toISOString(),
        });
        const userUpdated = await User.findById(_id);
        res.json({
            message: `Updated user (id:${_id}).`,
            updated: { userPatch },
            result: { userUpdated },
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

    if (!isValidId(_id)) {
        return res.status(404).send(`No user found with _id: ${_id}`);
    }
    try {
        const result = await User.findByIdAndDelete(_id);
        res.json({
            message: "Deleted user",
            result: result,
        });
    } catch (err) {
        console.log(err);
    }
}
