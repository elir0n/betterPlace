import mongoose from 'mongoose';
import Rating from '../models/Rating.js';
import User from '../models/User.js';

class RatingService {
  async createRating({ rater, rated, task, rating, feedback }) {
    const newRating = new Rating({
      rater,
      rated,
      task,
      rating,
      feedback
    });

    await newRating.save();
    await this.updateUserAverageRating(rated);

    await newRating.populate('rater', 'name phone');
    await newRating.populate('rated', 'name phone');

    return newRating;
  }

  async updateUserAverageRating(userId) {
    const [stats] = await Rating.aggregate([
      { $match: { rated: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$rated',
          totalRatings: { $sum: 1 },
          averageRating: { $avg: '$rating' }
        }
      }
    ]);

    if (!stats) {
      return { average: null, totalRatings: 0 };
    }

    const average = Math.round(stats.averageRating * 10) / 10;
    await User.findByIdAndUpdate(userId, { rating: average });
    return { average, totalRatings: stats.totalRatings };
  }

  async getUserRatingSummary(userId, limit = 10) {
    const [totalRatings, recentRatings] = await Promise.all([
      Rating.countDocuments({ rated: userId }),
      Rating.find({ rated: userId })
        .populate('rater', 'name phone')
        .populate('task', 'title')
        .sort({ createdAt: -1 })
        .limit(limit)
    ]);

    return { totalRatings, recentRatings };
  }
}

export default new RatingService();
