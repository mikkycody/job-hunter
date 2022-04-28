import { Op } from 'sequelize';
import models from '../models';

const getMessages = async (conversationId) => {
  try {
    const messages = await models.Message.findAll({
      // order: [['createdAt', 'DESC']],
      where: { conversationId },
    });
    return messages;
  } catch (err) {
    throw Error(err);
  }
};

const sendMessage = async (payload) => {
  try {
    return await models.Message.create(payload);
  } catch (err) {
    throw Error(err);
  }
};

const startConversation = async (userIds) => {
  try {
    const findUser = await models.User.findAll({ where: { id: userIds } });
    if (findUser.length !== userIds.length) {
      throw Error('User not found');
    }
    const [conversation] = await models.Conversation.findOrCreate({
      where: { participants: { [Op.contains]: userIds } },
      defaults: { participants: userIds },
    });

    const { participants } = conversation.dataValues;
    const users = await models.User.findAll({
      where: { id: participants },
    });
    if (!users) {
      throw Error('User not found');
    }
    return { ...conversation.dataValues, users };
  } catch (err) {
    throw Error(err);
  }
};

const getConversations = async (userId) => {
  try {
    const conversations = await models.Conversation.findAll({
      distinct: true,
      where: { participants: { [Op.contains]: [userId] } },
    });
    const updatedConvo = await Promise.all(
      conversations.map(async (conversation) => {
        const { participants } = conversation.dataValues;
        const users = await models.User.findAll({
          where: { id: participants },
        });
        const message = await models.Message.findOne({
          order: [['id', 'DESC']],
          where: { conversationId: conversation.id },
        });
        return { ...conversation.dataValues, users, message };
      })
    );
    return updatedConvo;
  } catch (err) {
    throw Error(err);
  }
};

export default {
  getMessages,
  sendMessage,
  startConversation,
  getConversations,
};
