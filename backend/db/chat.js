import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    owner : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    date: { type: Date, required: true },
    //messages should be an array of objects with the following properties:
    //role (user or AI)
    //message (a message string)
    messages: { type: Array, required: true }
});
