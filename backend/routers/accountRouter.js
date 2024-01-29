import express from "express";
import signup from "../middleware/signup.js"
import login from "../middleware/login.js"

const router = express.Router();

router.use(express.static("public"));

router.get("/", (req, res) => {
  res.redirect("https://smart-life-ai.onrender.com/");
});

router.get("/login", (req, res) => {
    res.redirect("https://smart-life-ai.onrender.com/Signup.html");
});

router.get("/register", (req, res) => {
    res.redirect("https://smart-life-ai.onrender.com/Signup.html");
});

router.post("/login", login ,(req, res) => {
    res.send("https://smart-life-ai.onrender.com/chat.html");
});

router.post("/register", signup)
export default router;