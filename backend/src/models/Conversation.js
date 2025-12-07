import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  task: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
    required: true
  },
  messages: [{
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: String,
    read: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

conversationSchema.index({ participants: 1, task: 1 });
conversationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.model("Conversation", conversationSchema);
