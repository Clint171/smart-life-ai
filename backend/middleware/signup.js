import schema from "../db/schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const signup = async (req, res, next) => {
    try {
        const dbUser = await schema.User.findOne({ $or: [{ username: req.body.username }, { email: req.body.email }] }).exec();
        if (dbUser) {
            return res.sendStatus(400);
        }
        const user = new schema.User(req.body);
        user.password = bcrypt.hash(user.password, process.env.SALT);
        user.save();
        const token = jwt.sign({id : user._id.toString()}, process.env.JWT_SECRET);

        res.cookie("token", token, {httpOnly: true});
        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}

export default signup;