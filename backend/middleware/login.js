import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../db/schema.js";

dotenv.config();

const login = async (req, res, next) => {
    //Check if user exists
    //Check if password matches
    //If both are true, attach user to request object
    //Else, send error
    try {
        //find user by username or email
        const user = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.username }]}).exec();
        if (!user) {
            return res.sendStatus(404);
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.sendStatus(401);
        }
        const token = jwt.sign({id : user._id.toString()}, process.env.JWT_SECRET);
        res.status(200).json({"token" : token});
    } catch (error) {
        return res.sendStatus(401);
    }
}

export default login;