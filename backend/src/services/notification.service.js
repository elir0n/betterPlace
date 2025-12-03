class NotificationService {
  constructor() {
    this.notifications = [];
  }

  async notifyNewOffer(taskId, offerUserId, taskCreatorId) {
    const notification = {
      id: this.generateId(),
      type: 'new_offer',
      taskId,
      from: offerUserId,
      to: taskCreatorId,
      message: 'Someone is interested in your task!',
      createdAt: new Date()
    };

    this.addNotification(notification);
    return notification;
  }

  async notifyMessage(conversationId, senderId, participants) {
    const recipients = participants.filter(p => p.toString() !== senderId.toString());

    const notifications = recipients.map(recipient => ({
      id: this.generateId(),
      type: 'new_message',
      conversationId,
      from: senderId,
      to: recipient,
      message: 'You have a new message',
      createdAt: new Date()
    }));

    notifications.forEach(notification => this.addNotification(notification));
    return notifications;
  }

  async notifyVerification(taskId, verificationId, helperId, requesterId) {
    const notification = {
      id: this.generateId(),
      type: 'task_completed',
      taskId,
      verificationId,
      from: helperId,
      to: requesterId,
      message: 'Task completed! Please review and approve.',
      createdAt: new Date()
    };

    this.addNotification(notification);
    return notification;
  }

  async notifyRating(taskId, ratingId, raterId, ratedId) {
    const notification = {
      id: this.generateId(),
      type: 'new_rating',
      taskId,
      ratingId,
      from: raterId,
      to: ratedId,
      message: 'You received a new rating!',
      createdAt: new Date()
    };

    this.addNotification(notification);
    return notification;
  }

  async getUserNotifications(userId) {
    return this.notifications.filter(n => n.to.toString() === userId.toString());
  }

  async markNotificationAsRead(notificationId) {
    const index = this.notifications.findIndex(n => n.id === notificationId);
    if (index !== -1) {
      this.notifications[index].read = true;
      return this.notifications[index];
    }
    return null;
  }

  addNotification(notification) {
    this.notifications.push(notification);

    if (this.notifications.length > 10000) {
      this.notifications = this.notifications.slice(-5000);
    }
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

export default new NotificationService();