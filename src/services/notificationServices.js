import models from '../models';

const addNotification = async (payload) => models.Notification.create(payload);
const getNotifications = async (userId) =>
  models.Notification.findAll({ where: { userId } });

export default { addNotification, getNotifications };
