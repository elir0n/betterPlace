import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/tasks.routes.js";
import walletRoutes from "./routes/wallet.routes.js";
import verificationRoutes from "./routes/verification.routes.js";
import ratingRoutes from "./routes/rating.routes.js";
import conversationRoutes from "./routes/conversation.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/wallet", walletRoutes);
app.use("/verify", verificationRoutes);
app.use("/rating", ratingRoutes);
app.use("/conversations", conversationRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
