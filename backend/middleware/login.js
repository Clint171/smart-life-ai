import bcrypt from "bcrypt";

const login = async (req, res, next) => {
    //Check if user exists
    //Check if password matches
    //If both are true, attach user to request object
    //Else, send error
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            throw new Error("User not found");
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            throw new Error("Password does not match");
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(400).send(error);
    }
}