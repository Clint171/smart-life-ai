import express from "express";
import accountRouter from "./routers/accountRouter.js";
import chatRouter from "./routers/chatRouter.js";
import cors from "cors"
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import socket from 'socket.io';

dotenv.config();


const app = express();

const port = process.env.PORT || 3000;

const url = process.env.MONGO_URL;

mongoose.set("strictQuery", false);
mongoose.connect(url , {
    dbName: "chatbot"
});

const db = mongoose.connection;

db.on("error", (error) => {
    console.log(error);
}
);

db.once("open", () => {
    console.log("Connected to database");
}
);

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("../frontend"));
app.use(accountRouter);
app.use(chatRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});