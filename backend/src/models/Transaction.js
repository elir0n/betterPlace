import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: { type: Number, required: true, min: 0.01 },
  type: {
    type: String,
    enum: ['task_payment', 'escrow_hold', 'escrow_release', 'refund', 'initial_bonus'],
    required: true
  },
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'refunded'],
    default: 'completed'
  },
  createdAt: { type: Date, default: Date.now }
});

transactionSchema.index({ from: 1, to: 1, createdAt: -1 });

export default mongoose.model("Transaction", transactionSchema);