import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import mongoose from 'mongoose';

class TokenService {
  async createEscrow(taskId, fromUser, toUser, amount) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const [from, to] = await Promise.all([
        User.findById(fromUser).session(session),
        User.findById(toUser).session(session)
      ]);

      if (!from || !to) {
        await session.abortTransaction();
        throw new Error('User not found');
      }

      if (from.tokenBalance < amount) {
        await session.abortTransaction();
        throw new Error('Insufficient token balance');
      }

      from.tokenBalance -= amount;
      await from.save({ session });

      const escrowUser = await User.findOne({ phone: 'system_escrow' }).session(session);
      if (!escrowUser) {
        const systemUser = new User({
          name: 'System Escrow',
          phone: 'system_escrow',
          password: 'system',
          tokenBalance: 0
        });
        await systemUser.save({ session });
      }

      const transaction = new Transaction({
        from: from._id,
        to: escrowUser._id,
        amount,
        type: 'escrow_hold',
        task: taskId,
        status: 'pending'
      });
      await transaction.save({ session });

      await session.commitTransaction();
      return transaction;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async releaseEscrow(verificationId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const transaction = await Transaction.findOne({
        type: 'escrow_hold',
        status: 'pending'
      }).populate('from task').session(session);

      if (!transaction) {
        await session.abortTransaction();
        throw new Error('No pending escrow found');
      }

      const escrowUser = await User.findOne({ phone: 'system_escrow' }).session(session);
      if (!escrowUser) {
        await session.abortTransaction();
        throw new Error('System escrow account not found');
      }

      const task = await this.getTaskAssignedUser(transaction.task._id);
      if (!task || !task.assignedTo) {
        await session.abortTransaction();
        throw new Error('Task assignment not found');
      }

      escrowUser.tokenBalance -= transaction.amount;
      await escrowUser.save({ session });

      const helper = await User.findById(task.assignedTo).session(session);
      helper.tokenBalance += transaction.amount;
      await helper.save({ session });

      transaction.status = 'completed';
      await transaction.save({ session });

      await session.commitTransaction();
      return transaction;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async refundEscrow(taskId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const transaction = await Transaction.findOne({
        task: taskId,
        type: 'escrow_hold',
        status: 'pending'
      }).populate('from').session(session);

      if (!transaction) {
        await session.abortTransaction();
        throw new Error('No pending escrow found');
      }

      const escrowUser = await User.findOne({ phone: 'system_escrow' }).session(session);
      if (!escrowUser) {
        await session.abortTransaction();
        throw new Error('System escrow account not found');
      }

      escrowUser.tokenBalance -= transaction.amount;
      await escrowUser.save({ session });

      transaction.from.tokenBalance += transaction.amount;
      await transaction.from.save({ session });

      transaction.status = 'refunded';
      await transaction.save({ session });

      await session.commitTransaction();
      return transaction;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async checkBalance(userId, requiredAmount) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user.tokenBalance >= requiredAmount;
  }

  async transferTokens(fromUserId, toUserId, amount, type, taskId = null) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const [from, to] = await Promise.all([
        User.findById(fromUserId).session(session),
        User.findById(toUserId).session(session)
      ]);

      if (!from || !to) {
        await session.abortTransaction();
        throw new Error('User not found');
      }

      if (from.tokenBalance < amount) {
        await session.abortTransaction();
        throw new Error('Insufficient token balance');
      }

      from.tokenBalance -= amount;
      to.tokenBalance += amount;

      await Promise.all([
        from.save({ session }),
        to.save({ session })
      ]);

      const transaction = new Transaction({
        from: fromUserId,
        to: toUserId,
        amount,
        type,
        task: taskId
      });
      await transaction.save({ session });

      await session.commitTransaction();
      return transaction;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async grantInitialTokens(userId) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const user = await User.findById(userId).session(session);
      if (!user) {
        await session.abortTransaction();
        throw new Error('User not found');
      }

      if (user.starterCompleted) {
        await session.abortTransaction();
        throw new Error('Initial tokens already granted');
      }

      const initialAmount = parseInt(process.env.INITIAL_TOKENS) || 10;
      user.tokenBalance += initialAmount;
      user.initialTokensEarned = initialAmount;
      user.starterCompleted = true;

      await user.save({ session });

      const transaction = new Transaction({
        from: null,
        to: userId,
        amount: initialAmount,
        type: 'initial_bonus'
      });
      await transaction.save({ session });

      await session.commitTransaction();
      return transaction;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getTaskAssignedUser(taskId) {
    const Task = mongoose.model('Task');
    return await Task.findById(taskId).select('assignedTo');
  }
}

export default new TokenService();