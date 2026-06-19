import express from "express"
const router = express.Router()
import {upload} from "../middlewares/multer.middleware.js";
import verifyToken from "../middlewares/auth.middleware.js";
import {sendMessage,getChat} from "../controllers/chat.controller.js"

router.route("/send-message").post(verifyToken,upload.single("attachment"),sendMessage)
router.route("/get-messages/:connectionId").get(verifyToken,getChat)


export default router 


