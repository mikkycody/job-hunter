import models from '../models';
import userServices from './userServices';

const amqp = require('amqplib/callback_api');

const create = async (payload) => models.MailingList.create(payload);

const getAll = async (limit, offset, userId = null) =>
  models.MailingList.findAndCountAll({
    where: { userId },
    limit,
    offset,
    distinct: true,
    include: {
      model: models.User,
      as: 'User',
      include: [
        {
          model: models.Role,
          as: 'Roles',
        },
        {
          model: models.Hashtag,
          as: 'Hashtags',
        },
        {
          model: models.Language,
          as: 'Languages',
        },
        {
          model: models.Resume,
          as: 'Resumes',
        },
        {
          model: models.SubAccount,
          as: 'SubAccount',
        },
        {
          model: models.EducationalBackground,
          as: 'Education',
        },
        {
          model: models.WorkExperience,
          as: 'WorkExperience',
        },
      ],
    },
  });

const sendActiveJobs = async () => {
  amqp.connect(process.env.AMPQ_URL, (err, connection) => {
    if (err) {
      throw err;
    }
    connection.createChannel(async (error1, channel) => {
      if (error1) {
        throw error1;
      }
      const queue = 'job-hunter-mailing-cron';
      channel.assertQueue(queue, {
        durable: true,
      });
      const users = await userServices.getCandidatesNoPaginate();
      for (let i = 0; i < users.length; i++) {
        channel.sendToQueue(queue, Buffer.from(users[i].dataValues.email), {
          persistent: true,
        });
      }
      console.log('Sent weekly email list to queue');
    });
  });
};
export default { create, getAll, sendActiveJobs };
