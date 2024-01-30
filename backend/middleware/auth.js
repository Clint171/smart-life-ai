import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
    if (req.headers.authorization) {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).redirect("/register");
        }
    }
    else {
        res.status(401).redirect("/register");
    }
}

export default auth;