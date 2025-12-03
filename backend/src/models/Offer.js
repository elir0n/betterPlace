import mongoose from "mongoose";

const offerSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: { type: String, maxlength: 500 },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  },
  createdAt: { type: Date, default: Date.now }
});

offerSchema.index({ task: 1, user: 1 });

export default mongoose.model("Offer", offerSchema);