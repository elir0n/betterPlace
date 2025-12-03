import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  skills: [String],
  tokenBalance: { type: Number, default: 0 },
  rating: { type: Number, default: 5 },
  profileImage: String,
  bio: { type: String, maxlength: 300 },
  location: {
    address: String,
    coordinates: [Number, Number]
  },
  starterCompleted: { type: Boolean, default: false },
  initialTokensEarned: { type: Number, default: 0 },
  totalTasksCompleted: { type: Number, default: 0 },
  totalTasksCreated: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
