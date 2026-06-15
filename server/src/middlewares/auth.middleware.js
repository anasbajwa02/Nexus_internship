import jwt from "jsonwebtoken"
import ApiError from "../utils/ApiError.js";
import User from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";

const verifyToken =  async (req,res,next) =>{
    const token = req.cookies.accessToken ||   req.header("Authorization")?.replace("Bearer ", "");
    if(!token){
        throw new ApiError(401, "Unauthorized: No token provided");
    }
    try{
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        const user = await User.findById(decoded.id);
        if(!user){
            throw new ApiError(401, "Unauthorized: User not found");
        }
        req.user = user;
        next();
    }
  catch(error){
    throw new ApiError(
        401,
        error?.message || "Invalid Access Token"
    );
}
}

export default verifyToken;