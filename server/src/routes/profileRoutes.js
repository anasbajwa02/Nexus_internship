import express from "express";
const router = express.Router();
import {upload} from "../middlewares/multer.middleware.js";
import verifyToken from "../middlewares/auth.middleware.js";
import {createProfile,getAllEntrepreneurs,getAllInvestors,getProfileByUserId} from "../controllers/profile.controller.js";
router.route("/create-profile").post(verifyToken, createProfile);
router.route("/investors").get(getAllInvestors);
router.route("/entrepreneurs").get(getAllEntrepreneurs);
router.route("/users/:userId").get(verifyToken, getProfileByUserId);

export default router;