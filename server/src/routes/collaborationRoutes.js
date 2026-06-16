import express from 'express';
const router = express.Router();
import verifyToken from '../middlewares/auth.middleware.js';
import {sendCollaborationRequest,getMyCollaborations,updateCollaborationStatus} from '../controllers/collaboration.controller.js';

// Send collaboration request
router.route("/request").post(verifyToken, sendCollaborationRequest);

// Get my collaborations
router.route("/my-collaborations").get(verifyToken, getMyCollaborations);
// Update collaboration status
router.route("/:collaborationId").patch(verifyToken, updateCollaborationStatus);
export default router;