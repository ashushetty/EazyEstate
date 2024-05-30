import { DataTypes, col } from "sequelize";
import getConnection from "../database.js";

const listingModel= {
    id:{
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    name:{
        type:DataTypes.STRING,
        allowNUll:false,
    },
    description:{
        type:DataTypes.STRING(500),
        allowNUll:false,
    },
    address:{
        type:DataTypes.STRING,
        allowNUll:false,
    },
    regularPrice:{
        type:DataTypes.FLOAT,
        allowNUll:false,
    },
    discountedPrice:{
        type:DataTypes.FLOAT,
        allowNUll:false,
    },  
    bathrooms:{
        type:DataTypes.FLOAT,
        allowNUll:false,
    },
    bedrooms:{
        type:DataTypes.FLOAT,
        allowNUll:false,
    },
    furnished:{
        type:DataTypes.BOOLEAN,
        allowNUll:false,
    },
    parking:{
        type:DataTypes.BOOLEAN,
        allowNUll:false,
    },
    type:{
        type:DataTypes.STRING,
        allowNUll:false,
    },
    offer:{
        type:DataTypes.BOOLEAN,
        allowNUll:false,
    },
    imageUrls:{
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNUll:false,
    },
    userRef:{
        type:DataTypes.STRING,
        allowNUll:false,
    }
};

const initListing = async ()=>{
    try{
        const sequelize = await getConnection();
        const listing= sequelize.define("listings", listingModel,{
            freezeTableName:true
        });
        await listing.sync({alter:true});
        return listing;

        
    }catch(err){
        console.error("listing-model-error",err.message);
        throw err;
    }
}

export default initListing;