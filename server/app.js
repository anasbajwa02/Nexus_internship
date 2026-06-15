import  "./src/config/env.js";
import dns from "dns";
dns.setServers(["1.1.1.1","8.8.8.8"])

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

//
import connectDB from "./src/config/db.js";

const app = express();

const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


import authRoutes from "./src/routes/authRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);

// Connect to MongoDB
connectDB();



app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

