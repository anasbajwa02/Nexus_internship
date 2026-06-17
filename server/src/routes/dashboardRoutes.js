import express from "express"
const router = express.Router()
import {getInvestorDashboard,getEntrepreneurDashboard} from "../controllers/dashboard.controller.js"
import verifyToken from "../middlewares/auth.middleware.js"

router.route("/investor").get(verifyToken,getInvestorDashboard)
router.route("/entrepreneur").get(verifyToken,getEntrepreneurDashboard)


export default router
