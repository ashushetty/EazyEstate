import { DataTypes } from "sequelize";
import getConnection from "../database.js";
import { toDefaultValue } from "sequelize/lib/utils";

const userModel={
   
    username:{
        type:DataTypes.STRING,
        required:true,
        unique:true

    },
    email:{
        type:DataTypes.STRING,
        required:true,
        

    },
    password:{
        type:DataTypes.STRING,
        required:true,
    

    },
};

let user=null;
const inituserData = async ()=>{
    try{
        if(user) return user;
        const sequelize = await getConnection();
        user= sequelize.define("user",userModel,{
            freezeTableName:true,
        });

        await user.sync({alter:true});
        return user;
        }catch(err){
        console.log("user-model-error", err.message);
    }
}

export default inituserData;