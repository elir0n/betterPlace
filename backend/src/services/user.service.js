import User from '../models/User.js';

class UserService {
  async getById(userId, projection) {
    return User.findById(userId).select(projection || undefined);
  }

  async ensureUser(userId, projection) {
    const user = await this.getById(userId, projection);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async incrementCounters(userId, counters = {}) {
    const inc = {};
    Object.entries(counters).forEach(([key, value]) => {
      inc[key] = value;
    });
    if (Object.keys(inc).length === 0) return null;
    return User.findByIdAndUpdate(userId, { $inc: inc }, { new: true });
  }
}

export default new UserService();
