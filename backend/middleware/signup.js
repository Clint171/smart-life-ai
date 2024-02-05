import User from "../db/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signup = async (req, res, next) => {
    try {
        const dbUser = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] }).exec();
        if (dbUser) {
            return res.sendStatus(400);
        }
        const user = new User(req.body);
        user.password = await bcrypt.hash(user.password, 8);
        user.save();
        const token = jwt.sign({id : user._id.toString()}, process.env.JWT_SECRET);
        res.status(201).json({"token" : token});
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export default signup;