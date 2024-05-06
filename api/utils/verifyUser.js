import RESPONSE from "../config/global.js";
import { send } from "../helper/responseHelper.js";
import jwt from 'jsonwebtoken';

export const verifyToken= (req,res,next)=>{
    const token= req.cookies.access_token;
    if(!token)
        return send(res,RESPONSE.UNAUTHORIZED);

    jwt.verify(token,process.env.JWT_SECRETKEY,(err,user)=>{
        if(err)
            return send(res,RESPONSE.FORBIDDEN);
        req.user= user;
        next();
    });
}