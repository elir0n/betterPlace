import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 1000 },
  category: {
    type: String,
    required: true,
    enum: ['tech-help', 'assembly', 'advice', 'delivery', 'cleaning', 'maintenance', 'tutoring', 'pet-care', 'shopping', 'other']
  },
  location: {
    address: String,
    coordinates: [Number, Number]
  },
  tokenReward: { type: Number, required: true, min: 1, max: 1000 },
  photos: [String],
  status: {
    type: String,
    enum: ['open', 'in_progress', 'awaiting_approval', 'completed', 'cancelled'],
    default: 'open'
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

taskSchema.index({ status: 1, createdAt: -1 });
taskSchema.index({ "location.coordinates": "2dsphere" });

export default mongoose.model("Task", taskSchema);
