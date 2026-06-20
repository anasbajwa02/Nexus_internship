import express from 'express';
const router = express.Router();
import verifyToken from '../middlewares/auth.middleware.js';
import {getMyConnections,getSingleConnection} from "../controllers/connection.controller.js"
router.route("/all-connections").get(verifyToken,getMyConnections)
router.route("/:connectionId").get(verifyToken,getSingleConnection)



export default router;