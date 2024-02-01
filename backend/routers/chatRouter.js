import express from "express";
import auth from "../middleware/auth.js";
import sendQuery from "../middleware/chat.js";

const router = express.Router();

//This router should use middleware to attach the user to the request object from the session

router.get("/chat", (req, res) => {
    res.redirect("https://smart-life-ai.onrender.com/chat.html");
});

router.post("/chat", sendQuery);

export default router;