import express from "express";
import { authCheck } from "../middleware/auth.middleware.js";
import {
  createTask,
  getTasks,
  getTaskById,
  makeOffer,
  updateTaskStatus
} from "../controllers/tasks.controller.js";

const router = express.Router();

router.post("/", authCheck, createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.post("/:id/offers", authCheck, makeOffer);
router.patch("/:id/status", authCheck, updateTaskStatus);

export default router;
