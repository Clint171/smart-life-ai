import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true, minlength: 5 },
    email: { type: String, required: true },
    chats: { type: Array, required: true }
});

userSchema.pre("save", function (next) {
    if (this.isModified("password")) {
        this.password = bcrypt.hash(this.password, 8);
    }
    next();
});

const User = mongoose.model("User", userSchema);

export default User;