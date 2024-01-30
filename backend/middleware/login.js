import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../db/user.js";

dotenv.config();

const login = async (req, res, next) => {
    //Check if user exists
    //Check if password matches
    //If both are true, attach user to request object
    //Else, send error
    console.log(req.body);
    try {
        //find user by username or email
        const user = await User.findOne({ $or: [{ username: req.body.username }, { email: req.body.username }]}).exec();
        if (!user) {
            res.status(404).send("User not found");
            return;
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            res.status(400).send("Incorrect password");
            return;
        }
        const token = jwt.sign(JSON.stringify(user), process.env.JWT_SECRET);
        res.status(200).json({"token" : token});
        next();
    } catch (error) {
        res.status(400).send(error);
    }
}

export default login;