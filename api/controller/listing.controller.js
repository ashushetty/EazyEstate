import { send } from "../helper/responseHelper.js";
import RESPONSE from "../config/global.js";
import initListing from '../models/listing.model.js';

export const createListing = async (req, res) => {
    try {
        const token = req.headers["access_token"]; // Extract the access token from the request headers
        console.log(token);
        // Check if access token exists
        if (!token) {
            return send(res, RESPONSE.ACCESS_DENIED);
        }

        const Listing = await initListing(); // Ensure Listing is properly initialized

        // Check if Listing is undefined
        if (!Listing) {
            throw new Error('Listing model is undefined');
        }

        // Create a new listing using Sequelize's create method
        const listing = await Listing.create(req.body);

        // Assuming 'send' function sends the response back to the client
        return send(res, RESPONSE.SUCCESS, listing);

    } catch (error) {
        console.error("listing-controller-error:", error.message);
        return send(res, RESPONSE.UNKNOW_ERROR);
    }
};


export const deleteListing = async (req, res,) =>{
    const listingModel = await initListing();
        const listingToDelete = await listingModel.findOne({
            where:{
                id: req.params.id}
            
        });

        if(!listingToDelete){
            return send(res,RESPONSE.NOT_FOUND)

        }
        if(req.user.id != listingToDelete.userRef.toString()){
            return send(res,RESPONSE.ACCESS_DENIED)
        }

        try{
            
            if(listingToDelete) {
                await listingToDelete.destroy();
                return send(res, RESPONSE.SUCCESS, { message: "listing deleted successfully." });
            } else {
                return send(res, RESPONSE.NOT_FOUND);
            }
        }

        catch(error){
            return send(res, RESPONSE.UNKNOW_ERROR);
        }
}


export const updateListing = async (req, res) => {
  try {
    const listingModel = await initListing();
    const listingToUpdate = await listingModel.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!listingToUpdate) {
      return send(res, RESPONSE.NOT_FOUND, { message: "Listing not found" });
    }

    if (req.user.id !== listingToUpdate.userRef.toString()) {
      return send(res, RESPONSE.ACCESS_DENIED);
    }

    await listingToUpdate.update(req.body);
    return send(res, RESPONSE.SUCCESS, listingToUpdate);

  } catch (err) {
    console.error("listing-controller-error:", err.message);
    return send(res, RESPONSE.UNKNOW_ERROR);
  }
};

export const getListing =async (req,res)=>{
  try{
    const listing = await initListing();
    const getlisting = await listing.findOne({
      where: {
        id: req.params.id,
      },
    });
   if (!getlisting){
    return send(res, RESPONSE.NOT_FOUND, { message: "Listing not found" });
   }
   return send(res,RESPONSE.SUCCESS,getlisting);

  }catch(error){
    return send(res, RESPONSE.UNKNOW_ERROR);
  }

}