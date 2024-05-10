import RESPONSE from "../config/global.js"
import { send, setErrResMsg } from "../helper/responseHelper.js"
import bcrypt from 'bcrypt';
import inituserData from "../models/user.model.js";

export const test=(req,res) =>{
    res.send("hello world")
}


export const updateUser = async (req,res) =>{

    try{
        if(req.user.id!==req.params.id){
            const updatedResponse = setErrResMsg(RESPONSE.UNAUTHORIZED,"Unauthorized..!")
            return send(res,updatedResponse)
        }
        if(req.body.password){
            req.body.password = await bcrypt.hash(req.body.password,10)
            
        }

        const userModel = await inituserData();
        const userToUpdate = await userModel.findOne({
            where:{
                user_id: req.params.id}
            
        });

        if(userToUpdate){
            const {username,email,avatar,password}= req.body;

            await userToUpdate.update({
                username: username || userToUpdate.username,
                email: email || userToUpdate.email,
                avatar: avatar || userToUpdate.avatar,
                password: password || userToUpdate.password
            });

            const updatedUser= await userModel.findOne({
                where:{user_id:req.params.id}
            });

            return send(res,RESPONSE.SUCCESS,updatedUser);
        }else{
            return send(res,RESPONSE.NOT_FOUND);
        }

    }catch(err){
        return send(res,RESPONSE.UNKNOW_ERROR)
    }
}

export const deleteUser = async (req, res, next) =>{
    try {
        if(req.user.id !== req.params.id) {
            const updatedResponse = setErrResMsg(RESPONSE.UNAUTHORIZED,"Unauthorized..!")
            return send(res, updatedResponse)
        }

        const userModel = await inituserData();
        const userToDelete = await userModel.findOne({
            where: {
                user_id: req.params.id
            }
        });

        if(userToDelete) {
            await userToDelete.destroy();
            return send(res, RESPONSE.SUCCESS, { message: "User deleted successfully." });
        } else {
            return send(res, RESPONSE.NOT_FOUND);
        }
    } catch(err) {
        return send(res, RESPONSE.UNKNOW_ERROR);
    }
}
