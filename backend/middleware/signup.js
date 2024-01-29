import User from "../db/user.js";
import bcrypt from "bcrypt";

const signup = async (req, res, next) => {
    try {
        const user = new User(req.body);
        user.password = await bcrypt.hash(user.password, 8);
        await user.save();
        res.redirect("https://smart-life-ai.onrender.com/Signup.html");
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}

export default signup;