import User from '../models/user.model.js';
import generateAccessAndRefreshTokens from '../utils/genrateTokens.js';
import {cookieOptions} from '../utils/options.js';
import ApiResponse from '../utils/ApiResponse.js';  
import ApiError from '../utils/ApiError.js';
import {uploadToCloudinary} from '../utils/cloudinary.js';

export const registerUser = async (req,res)=>{
    try{
        const {name,email,password,bio,role} = req.body;
        const profilePicture = req.file?.path;
        if (
  [name, email, password, role].some(
    field => field?.trim() === ""
  )
) {
  throw new ApiError(400, "Please fill all fields");
}
        if(!profilePicture){
            throw new ApiError(400, "Profile picture is required");
        }
        const existingUser = await User.findOne({email});
        if(existingUser){
            throw new ApiError(400, "User with this email already exists");
        }
        const cloudinaryResult = await uploadToCloudinary(profilePicture);
        if(!cloudinaryResult){
            throw new ApiError(500, "Failed to upload profile picture");
        }
        const user = await User.create({
            name,
            email,
            password,
            bio,
            role,
            avatar: cloudinaryResult.url
        });

        const tokens = await generateAccessAndRefreshTokens(user);

        const createdUser = await User.findById(user._id).select("-refreshToken");
        if(!createdUser){
            throw new ApiError(500, "Failed to create user");
        }


        res.cookie("accessToken", tokens.accessToken, cookieOptions);
        res.cookie("refreshToken", tokens.refreshToken, cookieOptions);
     res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
        
    }catch (error) {
    console.error(error);

    const apiError = new ApiError(
    error.statusCode || 500,
    error.message || "Internal Server Error"
);

console.log("api error ",apiError);
console.log("object api error",Object.keys(apiError));

return res.status(apiError.statusCode).json(apiError);

    return res.status(error.statusCode || 500).json(
        new ApiError(
            error.statusCode || 500,
            error.message || "Internal Server Error"
        )
    );
}
}

export const loginUser = async (req,res)=>{
    try{
        const {name,email,password} = req.body;
        if (
  [email, password].some(
    field => field?.trim() === ""
  )
) {
  throw new ApiError(400, "Please fill all fields");
}
        const user = await User.findOne({email}).select("+password");
        if(!user){
            throw new ApiError(404, "User not found");
        }
        const isPasswordValid = await user.matchPassword(password);
        if(!isPasswordValid){
            throw new ApiError(401, "Invalid credentials");
        }
        const tokens = await generateAccessAndRefreshTokens(user);
        const loggedInUser = await User.findById(user._id).select("-refreshToken");

        res.cookie("accessToken", tokens.accessToken, cookieOptions);
        res.cookie("refreshToken", tokens.refreshToken, cookieOptions);
        res.status(200).json(new ApiResponse(200, loggedInUser, "User logged in successfully"));

    }catch (error) {
    console.error(error);

    return res.status(error.statusCode || 500).json(
        new ApiError(
            error.statusCode || 500,
            error.message || "Internal Server Error"
        )
    );
}
}

export const logoutUser = async (req,res)=>{
    try{
        const user = req.user;
        await User.findByIdAndUpdate(
   user._id,
   {
      $unset:{
         refreshToken:1
      }
   }
)
        return res.status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "User logged out successfully"));
      
    }
   catch (error) {
    console.error(error);

    return res.status(error.statusCode || 500).json(
        new ApiError(
            error.statusCode || 500,
            error.message || "Internal Server Error"
        )
    );
}
}

export const getUserProfile = async (req,res)=>{
    try{
        const user = req.user;
        const userProfile = await User.findById(user._id).select("-refreshToken");
        if(!userProfile){
            throw new ApiError(404, "User not found");
        }
        res.status(200).json(new ApiResponse(200, userProfile, "User profile fetched successfully"));
    }catch (error) {
    console.error(error);

    return res.status(error.statusCode || 500).json(
        new ApiError(
            error.statusCode || 500,
            error.message || "Internal Server Error"
        )
    );
} 
}

export const allUsers = async (req,res)=>{
    try{
        const users = await User.find().select("-refreshToken");
        res.status(200).json(new ApiResponse(200, users, "All users fetched successfully"));
    }
   catch (error) {
    console.error(error);

    return res.status(error.statusCode || 500).json(
        new ApiError(
            error.statusCode || 500,
            error.message || "Internal Server Error"
        )
    );
}
}