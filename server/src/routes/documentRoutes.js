import express from "express";

const router = express.Router();

import verifyToken from "../middlewares/auth.middleware.js";

import { upload } from "../middlewares/multer.middleware.js";

import {
  uploadDocument,
  getMyDocuments,
  getDocumentsByEntrepreneur,
  getSingleDocument,
  updateDocument,
  deleteDocument,
} from "../controllers/document.controller.js";

router
  .route("/upload")

  .post(
    verifyToken,

    upload.single("document"),

    uploadDocument,
  );

router
  .route("/my-documents")

  .get(
    verifyToken,

    getMyDocuments,
  );

router
  .route("/:entrepreneurId")    

  .get(
    verifyToken,

    getDocumentsByEntrepreneur,
  );

router
  .route("/:documentId")

  .get(
    verifyToken,

    getSingleDocument,
  );

router
  .route("/:documentId")

  .patch(
    verifyToken,

    upload.single("document"),

    updateDocument,
  );

router
  .route("/:documentId")

  .delete(
    verifyToken,

    deleteDocument,
  );

export default router;
