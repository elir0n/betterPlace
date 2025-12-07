import Conversation from '../models/Conversation.js';
import Task from '../models/Task.js';
import notificationService from '../services/notification.service.js';

export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user.id
    })
    .populate('participants', 'name phone profileImage')
    .populate('task', 'title status tokenReward')
    .sort({ updatedAt: -1 });

    const conversationsWithLastMessage = conversations.map(conv => {
      const convObj = conv.toObject();
      const messages = convObj.messages || [];
      convObj.lastMessage = messages.length > 0 ? messages[messages.length - 1] : null;
      convObj.unreadCount = messages.filter(msg =>
        msg.sender.toString() !== req.user.id && !msg.read
      ).length;
      delete convObj.messages;
      return convObj;
    });

    res.json({
      success: true,
      data: conversationsWithLastMessage
    });

  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversations'
    });
  }
};

export const getConversationById = async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id)
      .populate('participants', 'name phone profileImage')
      .populate('task', 'title status tokenReward creator assignedTo');

    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    const isParticipant = conversation.participants.some(
      participant => participant._id.toString() === req.user.id
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    await Conversation.updateMany(
      {
        _id: req.params.id,
        'messages.sender': { $ne: req.user.id }
      },
      {
        $set: {
          'messages.$[elem].read': true
        }
      },
      {
        arrayFilters: [{ 'elem.sender': { $ne: req.user.id } }]
      }
    );

    const updatedConversation = await Conversation.findById(req.params.id)
      .populate('participants', 'name phone profileImage')
      .populate('task', 'title status tokenReward creator assignedTo');

    res.json({
      success: true,
      data: updatedConversation
    });

  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch conversation'
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const conversationId = req.params.id;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message content is required'
      });
    }

    if (content.length > 1000) {
      return res.status(400).json({
        success: false,
        error: 'Message cannot exceed 1000 characters'
      });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        error: 'Conversation not found'
      });
    }

    const isParticipant = conversation.participants.some(
      participant => participant.toString() === req.user.id
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        error: 'Access denied'
      });
    }

    const newMessage = {
      sender: req.user.id,
      content: content.trim(),
      timestamp: new Date(),
      read: false
    };

    conversation.messages.push(newMessage);
    conversation.updatedAt = new Date();
    await conversation.save();

    await notificationService.notifyMessage(
      conversationId,
      req.user.id,
      conversation.participants
    );

    const populatedConversation = await Conversation.findById(conversationId)
      .populate('participants', 'name phone profileImage')
      .populate('task', 'title status tokenReward');

    const populatedMessage = populatedConversation.messages[populatedConversation.messages.length - 1];
    await populatedMessage.populate('sender', 'name phone profileImage');

    res.status(201).json({
      success: true,
      data: populatedMessage,
      message: 'Message sent successfully'
    });

  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send message'
    });
  }
};
