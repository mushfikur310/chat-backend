import {} from 'dotenv/config';
import Users from '../providers/users';
import jwt from 'jsonwebtoken';

const isValidToken = () =>{
    return async (req,res,next) => {
        let {JWT_SECRET} = process.env;
        const user = new Users();
        if(!JWT_SECRET){
            console.error('JWT_SECRET is not defined! Please check .env settings');
            process.exit(1);
        }
        try{
            let {token} = req.headers;
            if(!token){
                throw 'Access denied!!';
            }
            const decodeToken = jwt.verify(token, JWT_SECRET, {
                algorithm: ["HS512"]
            });
            let data = await user.OnUserExists(decodeToken.user.username);
            if(!data){
                console.error('Invalid token.');
                throw 'Invalid token ! User is not exist.';
            }
            req.body.user = data.data;
            next();
        }catch(ex){
            console.error('Error in validating token.');
            res.status(401).json({
                status: false,
                message: 'Invalid authentication',
                error: ex
            })
        }
    }
}

export {isValidToken};