import User from "../db/user.js";

const signup = async (req, res, next) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.redirect("https://smart-life-ai.onrender.com/chat.html");
    } catch (error) {
        res.status(400).send(error);
    }
}

export default signup;