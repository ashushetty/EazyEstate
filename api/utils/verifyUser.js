import RESPONSE from "../config/global.js";
import { send } from "../helper/responseHelper.js";
import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  //   const token = req.cookies.access_token;
  const token = req.headers["access_token"];
   console.log(token);
  if (!token) return send(res, RESPONSE.ACCESS_DENIED);

  try {
    const user = jwt.verify(token, process.env.JWT_SECRETKEY);
    req.user = user;
  } catch (error) {
    return send(res, RESPONSE.FORBIDDEN);
  }
  return next();
};
