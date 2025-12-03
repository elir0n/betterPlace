import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

export const getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('tokenBalance');

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        balance: user.tokenBalance
      }
    });

  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch balance'
    });
  }
};

export const getTransactions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip = (page - 1) * limit;
    const type = req.query.type || 'all';

    let filter = {
      $or: [
        { from: req.user.id },
        { to: req.user.id }
      ]
    };

    if (type !== 'all') {
      if (type === 'sent') {
        filter = { from: req.user.id };
      } else if (type === 'received') {
        filter = { to: req.user.id };
      }
    }

    const transactions = await Transaction.find(filter)
      .populate('from', 'name phone')
      .populate('to', 'name phone')
      .populate('task', 'title')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Transaction.countDocuments(filter);

    const transactionsWithDirection = transactions.map(transaction => {
      const transObj = transaction.toObject();
      transObj.direction = transaction.from._id.toString() === req.user.id ? 'sent' : 'received';
      return transObj;
    });

    res.json({
      success: true,
      data: {
        transactions: transactionsWithDirection,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch transactions'
    });
  }
};