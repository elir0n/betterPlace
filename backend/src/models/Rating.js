import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  rater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rated: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  feedback: {
    type: String,
    maxlength: 500
  },
  createdAt: { type: Date, default: Date.now }
});

ratingSchema.index({ rated: 1, createdAt: -1 });
ratingSchema.index({ rater: 1, rated: 1, task: 1 }, { unique: true });

export default mongoose.model("Rating", ratingSchema);
