import express from "express";
import signup from "../middleware/signup"


const router = express.Router();

router.use(express.static("../"));

router.get("/", (req, res) => {
  res.redirect("https://smart-life-ai.onrender.com/");
});

router.get("/login", (req, res) => {
    res.redirect("https://smart-life-ai.onrender.com/Signup.html");
});

router.get("/register", (req, res) => {
    res.redirect("https://smart-life-ai.onrender.com/Signup.html");
});

router.post("/login", (req, res) => {
    
});

router.post("/register", signup)
export default router;