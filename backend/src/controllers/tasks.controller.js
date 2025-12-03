import Task from '../models/Task.js';
import User from '../models/User.js';
import Offer from '../models/Offer.js';
import Conversation from '../models/Conversation.js';
import tokenService from '../services/token.service.js';
import notificationService from '../services/notification.service.js';

export const createTask = async (req, res) => {
  try {
    const { title, description, category, location, tokenReward } = req.body;

    if (!title || title.trim().length === 0 || title.length > 100) {
      return res.status(400).json({
        success: false,
        error: 'Title is required and must be 1-100 characters'
      });
    }

    if (!description || description.trim().length === 0 || description.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Description is required and must be 1-1000 characters'
      });
    }

    const validCategories = ['tech-help', 'assembly', 'advice', 'delivery', 'cleaning', 'maintenance', 'tutoring', 'pet-care', 'shopping', 'other'];
    if (!category || !validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid category'
      });
    }

    if (!tokenReward || tokenReward < 1 || tokenReward > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Token reward must be between 1 and 1000'
      });
    }

    const user = await User.findById(req.user.id);
    if (user.tokenBalance < tokenReward) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient token balance to create this task'
      });
    }

    const task = new Task({
      title: title.trim(),
      description: description.trim(),
      category,
      location: location || {},
      tokenReward: parseInt(tokenReward),
      photos: req.body.photos || [],
      creator: req.user.id
    });

    await task.save();

    try {
      await tokenService.createEscrow(task._id, req.user.id, null, tokenReward);
    } catch (escrowError) {
      await Task.findByIdAndDelete(task._id);
      throw escrowError;
    }

    user.totalTasksCreated += 1;
    await user.save();

    await task.populate('creator', 'name phone');

    res.status(201).json({
      success: true,
      data: task,
      message: 'Task created successfully'
    });

  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create task'
    });
  }
};

export const getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const filter = { status: 'open' };

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.lat && req.query.lng && req.query.radius) {
      const radius = parseFloat(req.query.radius);
      filter.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)]
          },
          $maxDistance: radius * 1000
        }
      };
    }

    const tasks = await Task.find(filter)
      .populate('creator', 'name phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments(filter);

    res.json({
      success: true,
      data: {
        tasks,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tasks'
    });
  }
};

export const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('creator', 'name phone')
      .populate('assignedTo', 'name phone');

    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    const offersCount = await Offer.countDocuments({ task: task._id });

    const taskData = task.toObject();
    taskData.offersCount = offersCount;

    res.json({
      success: true,
      data: taskData
    });

  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch task'
    });
  }
};

export const makeOffer = async (req, res) => {
  try {
    const { message } = req.body;
    const taskId = req.params.id;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    if (task.creator.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'Cannot offer on your own task'
      });
    }

    if (task.status !== 'open') {
      return res.status(400).json({
        success: false,
        error: 'Task is not accepting offers'
      });
    }

    const existingOffer = await Offer.findOne({
      task: taskId,
      user: req.user.id
    });

    if (existingOffer) {
      return res.status(409).json({
        success: false,
        error: 'You have already made an offer on this task'
      });
    }

    const offer = new Offer({
      task: taskId,
      user: req.user.id,
      message: message ? message.trim().substring(0, 500) : ''
    });

    await offer.save();

    let conversation = await Conversation.findOne({
      task: taskId,
      participants: { $all: [task.creator, req.user.id] }
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [task.creator, req.user.id],
        task: taskId,
        messages: []
      });
      await conversation.save();
    }

    if (message && message.trim()) {
      conversation.messages.push({
        sender: req.user.id,
        content: message.trim().substring(0, 1000),
        timestamp: new Date()
      });
      await conversation.save();
    }

    await notificationService.notifyNewOffer(taskId, req.user.id, task.creator);

    await offer.populate('user', 'name phone');
    await conversation.populate('participants', 'name phone');

    res.status(201).json({
      success: true,
      data: {
        offer,
        conversation
      },
      message: 'Offer sent successfully'
    });

  } catch (error) {
    console.error('Error making offer:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to make offer'
    });
  }
};

export const updateTaskStatus = async (req, res) => {
  try {
    const { status, assignedTo } = req.body;
    const taskId = req.params.id;

    if (!['in_progress', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid status'
      });
    }

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }

    if (task.creator.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        error: 'Only task creator can update status'
      });
    }

    if (status === 'cancelled' && task.status === 'in_progress') {
      await tokenService.refundEscrow(taskId);
    }

    if (status === 'in_progress') {
      if (!assignedTo) {
        return res.status(400).json({
          success: false,
          error: 'assignedTo is required when setting status to in_progress'
        });
      }

      const assignedUser = await User.findById(assignedTo);
      if (!assignedUser) {
        return res.status(400).json({
          success: false,
          error: 'Assigned user not found'
        });
      }

      const offer = await Offer.findOne({
        task: taskId,
        user: assignedTo,
        status: 'pending'
      });

      if (!offer) {
        return res.status(400).json({
          success: false,
          error: 'User has not made an offer on this task'
        });
      }

      task.assignedTo = assignedTo;
      offer.status = 'accepted';
      await offer.save();

      await Offer.updateMany(
        { task: taskId, user: { $ne: assignedTo }, status: 'pending' },
        { status: 'rejected' }
      );
    }

    task.status = status;
    task.updatedAt = new Date();
    await task.save();

    await task.populate('creator assignedTo', 'name phone');

    res.json({
      success: true,
      data: task,
      message: `Task ${status.replace('_', ' ')} successfully`
    });

  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update task status'
    });
  }
};