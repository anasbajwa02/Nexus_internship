import express from "express";

const router = express.Router();

import verifyToken from "../middlewares/auth.middleware.js";

import { upload }

from "../middlewares/multer.middleware.js";

import {

 createDeal,

 getMyDeals,

 getSingleDeal,

 updateDeal,

 deleteDeal

}

from "../controllers/deal.controller.js";


router.route("/create-deal")

.post(

 verifyToken,

 upload.array("attachments"),

 createDeal

);


router.route("/all-deals")

.get(

 verifyToken,

 getMyDeals

);


router.route("/:dealId")

.get(

 verifyToken,

 getSingleDeal

);


router.route("/:dealId")

.patch(

 verifyToken,

 updateDeal

);


router.route("/:dealId")

.delete(

 verifyToken,

 deleteDeal

);


export default router;