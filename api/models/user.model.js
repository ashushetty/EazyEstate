import { DataTypes } from "sequelize";
import getConnection from "../database.js";



const userModel = {
  user_id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar:{
    type: DataTypes.STRING,
    defaultValue:"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"

  },
  isactive: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
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

        await user.sync({alter:true});
        return user;
        }catch(err){
        console.log("user-model-error", err.message);
    }
}

export default inituserData;