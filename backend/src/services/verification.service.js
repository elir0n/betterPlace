import Verification from '../models/Verification.js';

class VerificationService {
  async findByTaskAndHelper(taskId, helperId) {
    return Verification.findOne({ task: taskId, helper: helperId });
  }

  async createVerification({ taskId, helperId, requesterId, completionPhoto, helperNote }) {
    const verification = new Verification({
      task: taskId,
      helper: helperId,
      requester: requesterId,
      completionPhoto,
      helperNote
    });
    await verification.save();
    return verification;
  }

  async removeById(id) {
    return Verification.findByIdAndDelete(id);
  }
}

export default new VerificationService();
