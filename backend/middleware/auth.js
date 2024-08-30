import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
    if (req.cookies.token){
        try {
            let token = req.cookies.token;
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