import express from "express";
import { authCheck } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/protected", authCheck, (req, res) => {
  res.json({ message: "You are authenticated!", user: req.user });
});

export default router;
