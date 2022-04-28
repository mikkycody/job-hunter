/* eslint-disable no-plusplus */
import sendEmail from '../helpers/sendEmail';
import AuthServices from './authServices';
import UserServices from './userServices';
import { getPagination, getPagingData } from '../helpers/paginationHelper';
import jobsServices from './jobsServices';

const amqp = require('amqplib/callback_api');

function generatePassword(passwordLength) {
  const chars =
    '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let password = '';
  for (let i = 0; i <= passwordLength; i++) {
    const randomNumber = Math.floor(Math.random() * chars.length);
    password += chars.substring(randomNumber, randomNumber + 1);
  }

  return password;
}

const runBulkRegistration = async () => {
  try {
    amqp.connect(process.env.AMPQ_URL, (error0, connection) => {
      if (error0) {
        throw error0;
      }
      connection.createChannel((error1, channel) => {
        if (error1) {
          throw error1;
        }
        const queue = 'job-hunter-mailing-list';

        channel.assertQueue(queue, {
          durable: true,
        });
        channel.prefetch(1);

        console.log('Waiting for messages in %s', queue);
        channel.consume(
          queue,
          async (msg) => {
            console.log('Received emails');
            const userExists = await AuthServices.isExistingUser(
              msg.content.toString()
            );
            if (!userExists) {
              const password = generatePassword(10);
              const hashedPassword = await AuthServices.hashPassword(password);

              const checkUsername = await UserServices.getUserByUsername(
                msg.content.toString().split('@')[0]
              );
              let username = '';
              if (checkUsername) {
                username = `${msg.content.toString().split('@')[0]}${Math.floor(
                  Math.random() * 100
                )}`;
              } else {
                [username] = msg.content.toString().split('@');
              }
              const user = await AuthServices.registerUser({
                email: msg.content.toString(),
                username,
                password: hashedPassword,
                emailVerifiedAt: Date.now(),
              });
              await AuthServices.createUserRoles(user, 1);
              console.log('user creeated: %s', msg.content.toString());
              const html = `<h1>New Registration</h1>
            <h2>Hello ${username}</h2>
            <p>Your account has been registered, below are your credentials.</p>
            <p>Username: ${username}</p>
            <p>Password: ${password}</p>
            <p>Please <a href="google.com">login</a> to your account and change your password.</p>
            </div>`;
              await sendEmail(msg.content.toString(), 'Job Hunter', html);
              console.log('got here');
            }
            setTimeout(() => {
              channel.ack(msg);
            }, 1000);
          },
          {
            noAck: false,
          }
        );
      });
    });
  } catch (error) {
    console.log(error);
  }
};

const runBulkWeeklyJobs = async () => {
  try {
    amqp.connect(process.env.AMPQ_URL, (error0, connection) => {
      if (error0) {
        throw error0;
      }
      connection.createChannel((error1, channel) => {
        if (error1) {
          throw error1;
        }
        const queue = 'job-hunter-mailing-cron';

        channel.assertQueue(queue, {
          durable: true,
        });
        channel.prefetch(1);

        console.log('Waiting for messages in %s', queue);
        channel.consume(
          queue,
          async (msg) => {
            console.log('Received emails');

            const { limit, offset } = getPagination(1, 10);
            const data = await jobsServices.getJobsByStatus(
              limit,
              offset,
              'ACTIVE'
            );
            const jobs = getPagingData(data, 1, limit).data;
            let html = `<h1>Job Hunter Weekly Jobs</h1>
          <h2>Hello</h2>
          <p>Below are the jobs that are currently active.</p>
          <table>
          <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Location</th>
          <th>Type</th>
          <th>Category</th>
          </tr>`;
            jobs.forEach((job) => {
              const skills = [];
              job.Hashtags.map((hashtag) => skills.push(hashtag.name));
              html += `<tr>
            <td>${job.title}</td>
            <td>${job.description}</td>
            <td>${job.location}</td>
            <td>${job.jobType}</td>
            <td>${skills.toString()}</td>
            </tr>`;
            });
            html += `</table>`;

            await sendEmail(
              msg.content.toString(),
              'Job Hunter Weekly Jobs',
              html
            );
            console.log('got here');
            setTimeout(() => {
              channel.ack(msg);
            }, 1000);
          },
          {
            noAck: false,
          }
        );
      });
    });
  } catch (error) {
    console.log(error);
  }
};

export default { runBulkRegistration, runBulkWeeklyJobs };
