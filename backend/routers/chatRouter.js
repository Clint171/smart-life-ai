import express from "express";

const router = express.Router();

//This router should use middleware to attach the user to the request object from the session

router.get("/chat", (req, res) => {
    res.send("Chat page, or landing page if not logged in");
});

router.post("/chat", (req, res) => {
    res.send("chat page with response from AI, if logged in, else landing page");
});

export default router;