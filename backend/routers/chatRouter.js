import express from "express";
import auth from "../middleware/auth.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const router = express.Router();

//This router should use middleware to attach the user to the request object from the session
router.use(cookieParser());
router.use(bodyParser.json());
router.use(auth);

router.get("/chat", (req, res) => {
    res.send("Chat page, or landing page if not logged in");
});

router.post("/chat", (req, res) => {

});

export default router;