import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  skills: [String],
  tokenBalance: { type: Number, default: 0 },
  rating: { type: Number, default: 5 },
});

export default mongoose.model("User", userSchema);
