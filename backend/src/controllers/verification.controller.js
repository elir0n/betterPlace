import Verification from '../models/Verification.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import tokenService from '../services/token.service.js';
import notificationService from '../services/notification.service.js';
import { uploadSingle, uploadToCloudinary } from '../middleware/upload.middleware.js';
import verificationService from '../services/verification.service.js';

export const uploadCompletionPhoto = async (req, res) => {
  try {
    uploadSingle(req, res, async (error) => {
      if (error) {
        return res.status(400).json({
          success: false,
          error: error.message
        });
      }

      const { taskId, helperNote } = req.body;

      if (!taskId) {
        return res.status(400).json({
          success: false,
          error: 'Task ID is required'
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'Photo is required'
        });
      }

      let uploaded;
      try {
        uploaded = await uploadToCloudinary(req.file.buffer);
      } catch (cloudError) {
        return res.status(500).json({
          success: false,
          error: 'Failed to upload photo'
        });
      }

      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({
          success: false,
          error: 'Task not found'
        });
      }

      if (task.status !== 'in_progress') {
        return res.status(400).json({
          success: false,
          error: 'Task is not in progress'
        });
      }

      if (!task.assignedTo || task.assignedTo.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          error: 'Only assigned helper can upload completion photo'
        });
      }

      const existingVerification = await verificationService.findByTaskAndHelper(taskId, req.user.id);

      if (existingVerification) {
        return res.status(409).json({
          success: false,
          error: 'Verification already submitted for this task'
        });
      }

      const verification = await verificationService.createVerification({
        taskId,
        helperId: req.user.id,
        requesterId: task.creator,
        completionPhoto: uploaded.secure_url,
        helperNote: helperNote ? helperNote.trim().substring(0, 500) : ''
      });

      task.status = 'awaiting_approval';
      task.updatedAt = new Date();
      await task.save();

      await notificationService.notifyVerification(taskId, verification._id, req.user.id, task.creator);

      await verification.populate('helper', 'name phone');
      await verification.populate('requester', 'name phone');

      res.status(201).json({
        success: true,
        data: verification,
        message: 'Completion photo uploaded successfully'
      });
    });

  } catch (error) {
    console.error('Error uploading completion photo:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to upload completion photo'
    });
  }
};

export const approveCompletion = async (req, res) => {
  try {
    const { verificationId, approved } = req.body;

    if (!verificationId || typeof approved !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'Verification ID and approval status are required'
      });
    }

    const verification = await Verification.findById(verificationId)
      .populate('task')
      .populate('helper')
      .populate('requester');

    if (!verification) {
      return res.status(404).json({
        success: false,
        error: 'Verification not found'
      });
    }

    if (verification.requester._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Only task requester can approve completion'
      });
    }

    if (verification.requesterApproved !== null) {
      return res.status(400).json({
        success: false,
        error: 'Verification has already been processed'
      });
    }

    verification.requesterApproved = approved;
    verification.approvalDate = new Date();
    await verification.save();

    if (approved) {
      try {
        await tokenService.releaseEscrow(verification.task._id);

        verification.task.status = 'completed';
        await verification.task.save();

        await User.findByIdAndUpdate(verification.helper._id, {
          $inc: { totalTasksCompleted: 1 }
        });

        await notificationService.notifyRating(
          verification.task._id,
          verification._id,
          verification.requester._id,
          verification.helper._id
        );

        await notificationService.notifyRating(
          verification.task._id,
          verification._id,
          verification.helper._id,
          verification.requester._id
        );

      } catch (tokenError) {
        console.error('Error releasing escrow:', tokenError);
        return res.status(500).json({
          success: false,
          error: 'Failed to process token transfer'
        });
      }
    } else {
      try {
        await tokenService.refundEscrow(verification.task._id);

        verification.task.status = 'cancelled';
        await verification.task.save();

      } catch (tokenError) {
        console.error('Error refunding escrow:', tokenError);
        return res.status(500).json({
          success: false,
          error: 'Failed to process refund'
        });
      }
    }

    await verificationService.removeById(verificationId);

    res.json({
      success: true,
      data: {
        verification: {
          id: verificationId,
          approved,
          task: verification.task,
          helper: verification.helper,
          requester: verification.requester
        }
      },
      message: `Task completion ${approved ? 'approved' : 'rejected'} successfully`
    });

  } catch (error) {
    console.error('Error approving completion:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve completion'
    });
  }
};
