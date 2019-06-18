import {} from 'dotenv/config';
import jwt from 'jsonwebtoken';


let { JWT_SECRET } = process.env;

if(!JWT_SECRET){
    console.error("JWT_SECRET is not defined, Please check .env settings");
    process.exit(1);
}

const generateToken = (username,password) =>
    jwt.sign(
        {
            user: {username,password},
            iat: Math.floor(Date.now()/1000) - 30
        },
        JWT_SECRET,
        {algorithm: "HS512"}
    );


export {generateToken};