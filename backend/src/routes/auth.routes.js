import express from "express";
import { authCheck } from "../middleware/auth.middleware.js";
import { register, login, completeStarter } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/starter", authCheck, completeStarter);

export default router;
