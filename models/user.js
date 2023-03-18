import { db } from "../index.js";

const userSchema = new db.Schema({
    id: { type: String },
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    created_at: {
        type: Date,
        default: new Date(),
    },
});

const UserModel = db.model("users", userSchema);
export default UserModel;
