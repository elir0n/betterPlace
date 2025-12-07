import Task from '../models/Task.js';
import User from '../models/User.js';
import ratingService from '../services/rating.service.js';

export const submitRating = async (req, res) => {
  try {
    const { taskId, ratedUserId, rating, feedback } = req.body;

    if (!taskId || !ratedUserId || !rating) {
      return res.status(400).json({
        success: false,
        error: 'Task ID, rated user ID, and rating are required'
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        error: 'Rating must be between 1 and 5'
      });
    }

    if (ratedUserId === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'Cannot rate yourself'
      });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    if (task.status !== 'completed') {
      return res.status(400).json({
        success: false,
        error: 'Can only rate completed tasks'
      });
    }

    const isParticipant = (
      task.creator.toString() === req.user.id ||
      (task.assignedTo && task.assignedTo.toString() === req.user.id)
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        error: 'Only task participants can rate each other'
      });
    }

    const isRatedUserParticipant = (
      task.creator.toString() === ratedUserId ||
      (task.assignedTo && task.assignedTo.toString() === ratedUserId)
    );

    if (!isRatedUserParticipant) {
      return res.status(400).json({
        success: false,
        error: 'Can only rate task participants'
      });
    }

    const existingRating = await Rating.findOne({
      rater: req.user.id,
      rated: ratedUserId,
      task: taskId
    });

    if (existingRating) {
      return res.status(409).json({
        success: false,
        error: 'You have already rated this user for this task'
      });
    }

    const newRating = await ratingService.createRating({
      rater: req.user.id,
      rated: ratedUserId,
      task: taskId,
      rating: parseInt(rating),
      feedback: feedback ? feedback.trim().substring(0, 500) : ''
    });

    res.status(201).json({
      success: true,
      data: newRating,
      message: 'Rating submitted successfully'
    });

  } catch (error) {
    console.error('Error submitting rating:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to submit rating'
    });
  }
};

export const getUserRatings = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const summary = await ratingService.getUserRatingSummary(userId);

    res.json({
      success: true,
      data: {
        averageRating: user.rating || 0,
        totalRatings: summary.totalRatings,
        recentRatings: summary.recentRatings
      }
    });

  } catch (error) {
    console.error('Error fetching user ratings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user ratings'
    });
  }
};
