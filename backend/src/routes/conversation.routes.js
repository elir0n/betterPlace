import express from "express";
import { authCheck } from "../middleware/auth.middleware.js";
import {
  getConversations,
  getConversationById,
  sendMessage
} from "../controllers/conversations.controller.js";

const router = express.Router();

router.get("/", authCheck, getConversations);
router.get("/:id", authCheck, getConversationById);
router.post("/:id/messages", authCheck, sendMessage);

export default router;