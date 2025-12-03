import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  helper: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  completionPhoto: String,
  helperNote: { type: String, maxlength: 500 },
  requesterApproved: {
    type: Boolean,
    default: null
  },
  approvalDate: Date,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Verification", verificationSchema);