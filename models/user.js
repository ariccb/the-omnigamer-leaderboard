import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id: { type: String },
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    created_at: {
        type: Date,
        default: new Date(),
    },
});

const UserModel = mongoose.model("users", userSchema);
export default UserModel;
