import { DataTypes } from "sequelize";
import getConnection from "../database";
import { toDefaultValue } from "sequelize/lib/utils";

const userModel={
   
    username:{
        type:String,
        required:true,
        unique:true

    },
    email:{
        type:DataTypes.email,
        required:true,
        

    },
    password:{
        type:String,
        required:true,
    

    },
};

let user=null;
const inituserData = async ()=>{
    try{
        if(user) return user;
        const sequelize = await getConnection();
        user= sequelize.define("users",userModel,{
            freezeTableName:true,
        });

        await user.sync({alter:true}):
        return user;
        }catch(err){
        console.log("user-model-error", err.message);
    }
}

export default inituserData;