import User from "../db/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signup = async (req, res, next) => {
    try {
        const dbUser = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] }).exec();
        if (dbUser) {
            res.status(400).send("User already exists");
            return;
        }
        const user = new User(req.body);
        user.password = await bcrypt.hash(user.password, 8);
        await user.save();
        const token = jwt.sign(JSON.stringify(user), process.env.JWT_SECRET);
        res.status(201).json({"token" : token});
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
}

export default signup;