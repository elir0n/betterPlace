import express from "express";
import { authCheck } from "../middleware/auth.middleware.js";
import {
  uploadCompletionPhoto,
  approveCompletion
} from "../controllers/verification.controller.js";

const router = express.Router();

router.post("/upload", authCheck, uploadCompletionPhoto);
router.post("/approve", authCheck, approveCompletion);

export default router;
