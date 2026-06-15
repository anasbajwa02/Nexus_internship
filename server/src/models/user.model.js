import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
    },
    password:{
        type:String,
        required:true,
        select:false,
    },
    role:{
        type:String,
        enum:["investor", "entrepreneur"],
        required:true,
    },
    avatar:{
        type:String,
        default:'',
    },
    bio:{
        type:String,
        default:'',
    },
    isProfileCompleted:{
       type: Boolean,
      default: false
    },
    refreshToken:{
    type:String,
}

},{
    timestamps:true,
})

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword= async function(password){
  return await bcrypt.compare(password, this.password);
}


// access token generation method
userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
      email: this.email
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    }
  )
}

// refresh token generation method

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      id: this._id
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  );
};

const User = mongoose.model("User", userSchema);

export default User;