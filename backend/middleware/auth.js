import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
    if (req.headers["authorization"]) {
        try {
            const authHeader = req.headers["authorization"];
            let token = authHeader && authHeader.split(' ')[1];
            jwt.verify(token, process.env.JWT_SECRET, (err , user)=>{
                if(err){
                    console.log(err);
                    return res.sendStatus(403);
                }
                req.user = user;
                next();
            });
        } catch (error) {
            console.log(error);
            return res.sendStatus(401);
        }
    }
    else {
        return res.sendStatus(401);
    }
}

export default auth;