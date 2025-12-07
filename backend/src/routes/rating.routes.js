import express from "express";
import { authCheck } from "../middleware/auth.middleware.js";
import {
  submitRating,
  getUserRatings
} from "../controllers/rating.controller.js";

const router = express.Router();

router.post("/", authCheck, submitRating);
router.get("/:userId", getUserRatings);

export default router;
