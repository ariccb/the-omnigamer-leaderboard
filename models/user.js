import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true },
    created_at: {
        type: Date,
        default: new Date(),
    },
    updated_at: {
        type: Date,
    },
    omni_score: { type: Number, default: 0 },
});

const User = mongoose.model("users", userSchema);
export default User;
