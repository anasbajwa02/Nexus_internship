import express from "express";
const router = express.Router();
import {upload} from "../middlewares/multer.middleware.js";
import {registerUser,loginUser,logoutUser,getUserProfile,allUsers} from "../controllers/user.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(verifyToken,logoutUser);
router.route("/me").get(verifyToken,getUserProfile)
router.route("/users").get(allUsers);
export default router;