/* eslint-disable no-plusplus */
import validateMailingList from '../helpers/validateMailingList';
import mailingService from '../services/mailingService';
import { getPagination, getPagingData } from '../helpers/paginationHelper';

const csv = require('fast-csv');

const fs = require('fs');

const https = require('https');

const amqp = require('amqplib/callback_api');

function getCsvFromLink(link) {
  return new Promise((resolve, reject) => {
    https.get(link, (response) => {
      response.pipe(fs.createWriteStream('sample.csv'));
      resolve('file written');
    });
  });
}

function validateEmail(email) {
  const mailformat = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
  if (email.match(mailformat)) {
    return true;
  }
  return false;
}

const sendMail = async (req, res) => {
  try {
    const { error } = validateMailingList(req.body);
    if (error) {
      return res.status(400).json({
        status: 400,
        error: error.details[0].message,
      });
    }
    const emails = [];
    await getCsvFromLink(req.body.link);

    fs.createReadStream('sample.csv')
      .pipe(csv.parse())
      .on('error', (errorMsg) => console.error(errorMsg))
      .on('data', (row) => {
        // eslint-disable-next-line array-callback-return
        row.map((email) => {
          const validated = validateEmail(email);
          if (validated) {
            emails.push(email);
          }
        });
      })
      .on('end', async () => {
        amqp.connect(process.env.AMPQ_URL, (err, connection) => {
          if (err) {
            throw err;
          }
          connection.createChannel(async (error1, channel) => {
            if (error1) {
              throw error1;
            }
            const queue = 'job-hunter-mailing-list';
            channel.assertQueue(queue, {
              durable: true,
            });
            for (let i = 0; i < emails.length; i++) {
              channel.sendToQueue(queue, Buffer.from(emails[i]), {
                persistent: true,
              });
            }
            await mailingService.create({
              link: req.body.link,
              userId: req.user.id,
            });
            console.log('Sent email list to queue');
          });
        });
        res.status(200).json({
          status: 'success',
          data: emails,
        });
      });
  } catch (err) {
    res.status(500).json({
      error: err?.message,
    });
  }
};

const getList = async (req, res) => {
  try {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const data = await mailingService.getAll(
      limit,
      offset,
      req.user ? req.user.id : null
    );
    const mailingList = getPagingData(data, page, limit);
    return res.status(200).json({
      mailingList,
    });
  } catch (err) {
    res.status(500).json({
      error: err?.message,
    });
  }
};

export default { sendMail, getCsvFromLink, getList };
