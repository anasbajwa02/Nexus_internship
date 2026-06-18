import express from "express"
const router = express.Router()
import verifyToken from "../middlewares/auth.middleware.js"
import {createMeeting,getMyMeetings,updateMeetingStatus} from "../controllers/meeting.controller.js"

 
router.route("/create-meeting").post(verifyToken,createMeeting)
router.route("/all-meetings").get(verifyToken,getMyMeetings)
router.route("/update-meeting/:id").patch(verifyToken,updateMeetingStatus)


export default router
