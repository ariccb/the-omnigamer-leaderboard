import UserModel from "../models/user.js";
import { db } from "../index.js";

export async function getUsers(req, res) {
    res.json();
}

export async function createUser(req, res) {
    const { email, username, first_name, last_name } = req.body;
    try {
        const existingUser = await UserModel.findOne({ email });
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
                name: `${first_name} ${last_name}`,
                created_at: new Date().toISOString(),
            });
            res.status(201).json({ user: newUser });
            // save() to the mongo db using mongoose
        }
    } catch (error) {
        res.status(500).json({ message: "Something went wrong." });
    }
}

export async function updateUser(req, res) {}
export async function patchUser(req, res) {}
export async function deleteUser(req, res) {}

/** this is all the functionality I had before refactoring  
 
export function getAllUsers() {
    return users;
}
export function addUser(newUser) {
    users.push(newUser);
}

export function updateUser(id, update) {
    const user = users.find((x) => x.id === +id);
    console.log(`found ${users.id}`);
    Object.assign(user, update);
}
// TODO - just need to figure out why i'm getting empty objects between new users {}

export function deleteUser(searchId) {
    users = users.filter((x) => x.id !== +searchId); // reassigns the entire users array back to
    // the same variable EXCEPT for the user object that has an id that matches the search ID
}
**/
