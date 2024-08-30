import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, minlength: 3},
    password: { type: String, required: true, minlength: 5 },
    email: { type: String, required: true, unique: true },
    chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chat" }],
});

const User = mongoose.model("User", userSchema);

const chatSchema = new mongoose.Schema({
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    messages: { type: Array, required: true }
});

const Chat = mongoose.model("Chat", chatSchema);

export default {Chat , User};