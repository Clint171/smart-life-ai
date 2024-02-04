import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    messages: { type: Array, required: true }
});

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;