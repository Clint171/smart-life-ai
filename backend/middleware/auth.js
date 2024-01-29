import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
    if (req.cookies.token) {
        try {
            const token = req.cookies.token;
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            next();
        } catch (error) {
            res.status(401).redirect("https://smart-life-ai.onrender.com/Signup.html");
        }
    }
    else {
        res.status(401).redirect("https://smart-life-ai.onrender.com/Signup.html");
    }
}

export default auth;