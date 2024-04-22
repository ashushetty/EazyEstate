import RESPONSE from '../config/global.js';
import { send, setErrResMsg } from '../helper/responseHelper.js';
import inituserData from '../models/user.model.js';
import bcrypt from 'bcrypt'

export  const signup= async(req, res)=>{
    try{
        const {username, email, password} = req.body;

    const newuser= await inituserData();

    if(!username || username ==""){
        const  updatedResponse = setErrResMsg(
            RESPONSE.REQUIRED_PARAMS,"username"
            
        );
        return send (res,updatedResponse);
    }
    if(!email || email ==""){
        const  updatedResponse = setErrResMsg(
            RESPONSE.REQUIRED_PARAMS,"email"
            
        );
        return send (res,updatedResponse);
    }

    if(!password|| password==""){
        const  updatedResponse = setErrResMsg(
            RESPONSE.REQUIRED_PARAMS,"password"
            
        );
        return send (res,updatedResponse);
    }
    const isExistingEmail= await newuser.findOne({
        where:{
            email:email,
        }

    })

    if(isExistingEmail){
        const updatedResponse = setErrResMsg(RESPONSE.EXISTING_DATA,"Email");
        return send(res,updatedResponse);
    }
    const encryptedPassword =  bcrypt.hashSync(password, 10);
    

    await newuser.create({
        email:email,
        username:username,
        password:encryptedPassword,
    });

    return send(res, RESPONSE.SUCCESS)

    }catch(err){
        console.log(err);
        return send(res, RESPONSE.UNKNOW_ERROR);

    }
    
    
}
