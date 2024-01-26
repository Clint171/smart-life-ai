import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Landing page, or chat page if logged in");
});

router.get("/login", (req, res) => {
    res.send("Login page");
});

router.get("/register", (req, res) => {
    res.send("Register page");
});

router.post("/login", (req, res) => {
    res.send("chat page if login successful, login page if not");
});

router.post("/register", (req, res) => {
    res.send("chat page if register successful, register page if not");
});

export default router;