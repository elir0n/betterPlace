import Task from '../models/Task.js';
import Offer from '../models/Offer.js';

class TaskService {
  buildTaskFilter(query) {
    const filter = { status: 'open' };

    if (query.category) {
      filter.category = query.category;
    }

    if (query.lat && query.lng && query.radius) {
      const radius = parseFloat(query.radius);
      filter.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(query.lng), parseFloat(query.lat)]
          },
          $maxDistance: radius * 1000
        }
      };
    }

    return filter;
  }

  async getTasks(query) {
    const page = parseInt(query.page) || 1;
    const limit = Math.min(parseInt(query.limit) || 10, 50);
    const skip = (page - 1) * limit;

    const filter = this.buildTaskFilter(query);

    const [tasks, total] = await Promise.all([
      Task.find(filter)
        .populate('creator', 'name phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Task.countDocuments(filter)
    ]);

    return {
      tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getTaskWithOfferCount(taskId) {
    const task = await Task.findById(taskId)
      .populate('creator', 'name phone')
      .populate('assignedTo', 'name phone');

    if (!task) return null;

    const offersCount = await Offer.countDocuments({ task: task._id });
    const taskData = task.toObject();
    taskData.offersCount = offersCount;
    return taskData;
  }
}

export default new TaskService();
