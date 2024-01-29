import express from "express";
import db from "./db/db.js"
import accountRouter from "./routers/accountRouter.js";
import chatRouter from "./routers/chatRouter.js";
import cors from "cors"



const app = express();

const port = process.env.PORT || 3000;

const corsOptions = {
    origin: "https://smart-life-ai.onrender.com",
    optionsSuccessStatus: 200,
    credentials: true,
    methods: "GET, POST",
    allowedHeaders: "Content-Type, Authorization"
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("../frontend"));
app.use(accountRouter);
app.use(chatRouter);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});