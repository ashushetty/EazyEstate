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
