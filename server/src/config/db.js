import mongoose from "mongoose";


const connectDB = async () => {
    const MONGO_URI = `${process.env.MONGO_URI}/nexus`;
   
    try{
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1);
    }
}

export default connectDB;