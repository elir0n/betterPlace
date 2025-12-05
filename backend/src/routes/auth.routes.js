import express from "express";
import { register, login, getMe } from "../controllers/auth.controller.js";
import { authCheck } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authCheck, getMe);

export default router;
