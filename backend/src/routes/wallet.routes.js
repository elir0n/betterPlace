import express from "express";
import { authCheck } from "../middleware/auth.middleware.js";
import {
  getBalance,
  getTransactions
} from "../controllers/wallet.controller.js";

const router = express.Router();

router.get("/balance", authCheck, getBalance);
router.get("/transactions", authCheck, getTransactions);

export default router;
