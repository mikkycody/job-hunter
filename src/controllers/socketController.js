/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';
import MessageService from '../services/messageService';
import NotificationService from '../services/notificationServices';

const socketEvents = () => {
  try {
    io.use((socket, next) => {
      if (socket.handshake.query && socket.handshake.query.token) {
        jwt.verify(
          socket.handshake.query.token,
          process.env.JWT_SECRET,
          (err, decoded) => {
            if (err) return next(new Error('Authentication error'));
            socket.decoded = decoded;
            next();
          }
        );
      } else {
        next(new Error('Authentication error'));
      }
    }).on('connection', (socket) => {
      console.log('Made socket connection');

      socket.on('start_conversation', async (data) => {
        try {
          const conversation = await MessageService.startConversation(
            data.participants
          );
          socket.join(conversation.id);
          socket.emit('start_conversation', conversation);
        } catch (err) {
          socket.emit('socket_error', err?.message);
        }
      });

      socket.on('send_message', async (data) => {
        try {
          const message = await MessageService.sendMessage(data);
          io.sockets
            .in(message.conversationId)
            .emit('receive_message', message);
        } catch (err) {
          socket.emit('socket_error', err?.message);
        }
      });

      socket.on('get_messages', async (data) => {
        try {
          const messages = await MessageService.getMessages(
            data.conversationId
          );
          io.sockets.in(data.conversationId).emitw('get_messages', messages);
        } catch (err) {
          socket.emit('socket_error', err?.message);
        }
      });

      socket.on('get_conversations', async (data) => {
        try {
          const conversations = await MessageService.getConversations(
            data.userId
          );
          socket.emit('get_conversations', conversations);
        } catch (err) {
          socket.emit('socket_error', err?.message);
        }
      });

      socket.on('get_notifications', async (data) => {
        try {
          const notifications = await NotificationService.getNotifications(
            data.userId
          );
          socket.emit('get_notifications', notifications);
        } catch (err) {
          socket.emit('socket_error', err?.message);
        }
      });
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

export default socketEvents;
