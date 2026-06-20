import express from "express";

const router = express.Router();

import verifyToken from "../middlewares/auth.middleware.js";

import {

  getNotifications,

  markNotificationRead

}

from "../controllers/notification.controller.js";

router.route("/get-notifications")

.get(

  verifyToken,

  getNotifications

);

router.route("/:notificationId")

.patch(

  verifyToken,

  markNotificationRead

);

export default router;