/* eslint-disable no-return-assign */
/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
import moment from 'moment';
import models from '../models';
import createStripeLink from '../helpers/createStripeLink';
import createPaypalLink from '../helpers/createPaypalLink';
import createCoinbaseLink from '../helpers/createCoinbaseLink';
import { FRONTEND_URL } from '../config/constants';
import NotificationService from './notificationServices';
import splitCampaign from '../helpers/splitCampaign';

// const nodemailer = require('nodemailer');

const Sequelize = require('sequelize');

const { Op } = Sequelize;

/**
 *
 * @param {*} userPayload
 * @returns {object}
 */
const createJob = async (JobPayload) => {
  try {
    return await models.Job.create(JobPayload);
  } catch (err) {
    throw Error(err);
  }
};

const addJobHashtag = async (payload) => {
  try {
    return await models.JobHashtag.bulkCreate(payload);
  } catch (err) {
    throw Error(err);
  }
};

const getJob = async (id, userId = null) => {
  try {
    return await models.Job.findOne({
      where: { id },
      include: [
        {
          model: models.Hashtag,
          as: 'Hashtags',
        },
        {
          model: models.JobCategory,
          as: 'Category',
        },
        {
          model: models.Subcategory,
          as: 'SubCategory',
        },
        {
          model: models.User,
          as: 'User',
        },
        {
          model: models.JobApplication,
          as: 'JobApplications',
          where: userId ? { userId } : { id: 0 },
          required: false,
        },
        {
          model: models.Bookmark,
          as: 'Bookmarks',
          where: userId ? { userId, jobId: id } : { id: 0 },
          required: false,
        },
      ],
    });
  } catch (err) {
    throw Error(err);
  }
};

const getJobsByIds = async (ids, userId, limit, offset) => {
  try {
    return await models.Job.findAndCountAll({
      where: { id: ids },
      limit,
      offset,
      distinct: true,
      include: [
        {
          model: models.Hashtag,
          as: 'Hashtags',
        },
        {
          model: models.JobCategory,
          as: 'Category',
        },
        {
          model: models.Subcategory,
          as: 'SubCategory',
        },
        {
          model: models.User,
          as: 'User',
        },
        {
          model: models.JobApplication,
          as: 'JobApplications',
          where: userId ? { userId } : { id: 0 },
          required: false,
        },
        {
          model: models.Bookmark,
          as: 'Bookmarks',
          where: userId ? { userId, jobId: ids } : { id: 0 },
          required: false,
        },
      ],
    });
  } catch (err) {
    throw Error(err);
  }
};

const getFeaturedJobs = async (userId, limit, offset) => {
  try {
    const whereStatement = {
      isPromoted: true,
      promotionEndDate: { [Op.gte]: Date.now() },
    };
    return await models.Job.findAndCountAll({
      where: whereStatement,
      order: [
        ['promotionAmountPerDay', 'DESC'],
        ['promotionEndDate', 'DESC'],
      ],
      limit,
      offset,
      distinct: true,
      include: [
        {
          model: models.Hashtag,
          as: 'Hashtags',
        },
        {
          model: models.JobCategory,
          as: 'Category',
        },
        {
          model: models.Subcategory,
          as: 'SubCategory',
        },
        {
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
              model: models.Resume,
              as: 'Resumes',
            },
          ],
        },
        {
          model: models.JobApplication,
          // attributes: [],
          where: userId ? { userId } : { id: 0 },
          required: false,
          as: 'JobApplications',
        },
        {
          model: models.Bookmark,
          as: 'Bookmarks',
          where: userId ? { userId, jobId: { [Op.col]: 'Job.id' } } : { id: 0 },
          required: false,
        },
      ],
      attributes: {
        include: [
          [
            Sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM "JobApplications" AS application
                    WHERE
                        application."jobId" = "Job".id
                )`),
            'JobApplicationsCount',
          ],
        ],
      },
    });
  } catch (err) {
    throw Error(err);
  }
};

const getJobs = async (userId, status = null, limit, offset) => {
  try {
    const whereStatement = {};
    if (userId) {
      whereStatement.userId = userId;
    }
    if (status) {
      whereStatement.status = status;
    }
    return await models.Job.findAndCountAll({
      where: whereStatement,
      limit,
      offset,
      distinct: true,
      include: [
        {
          model: models.Hashtag,
          as: 'Hashtags',
        },
        {
          model: models.JobCategory,
          as: 'Category',
        },
        {
          model: models.Subcategory,
          as: 'SubCategory',
        },
        {
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
              model: models.Resume,
              as: 'Resumes',
            },
          ],
        },
        {
          model: models.JobApplication,
          // attributes: [],
          where: userId ? { userId } : { id: 0 },
          required: false,
          as: 'JobApplications',
        },
        {
          model: models.Bookmark,
          as: 'Bookmarks',
          where: userId ? { userId, jobId: { [Op.col]: 'Job.id' } } : { id: 0 },
          required: false,
        },
      ],
      attributes: {
        include: [
          [
            Sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM "JobApplications" AS application
                    WHERE
                        application."jobId" = "Job".id
                )`),
            'JobApplicationsCount',
          ],
        ],
      },
    });
  } catch (err) {
    throw Error(err);
  }
};

const updateJob = async (JobId, payload) => {
  try {
    if (payload.hashtags) {
      await models.JobHashtag.destroy({ where: { jobId: JobId } });
    }
    return await models.Job.update(payload, {
      where: { id: JobId },
      returning: true,
    });
  } catch (err) {
    throw Error(err);
  }
};

const deleteJob = async (id) => {
  try {
    const jobApplicationIds = await models.JobApplication.findAll({
      where: { jobId: id },
      attributes: ['id'],
    });
    const ids = jobApplicationIds.map(
      (jobApplication) => jobApplication.dataValues.id
    );
    await models.JobReferral.destroy({ where: { jobApplicationId: ids } });
    await models.JobApplication.destroy({ where: { jobId: id } });
    await models.Bookmark.destroy({ where: { jobId: id } });
    return await models.Job.destroy({ where: { id } });
  } catch (err) {
    throw Error(err);
  }
};

const promoteJob = async (jobId, payload) => {
  try {
    const findJob = await getJob(jobId);
    if (payload.type === 'stripe') {
      const successUrl = `${FRONTEND_URL}/employer/jobs/${findJob.id}?token=${payload.token}&status=true&type=payment&payment=true`;
      const cancelUrl = `${FRONTEND_URL}/employer/jobs/${findJob.id}?token=${payload.token}&status=false&type=payment&payment=true`;
      const meteData = {
        jobId: findJob.id,
        number_of_days: payload.number_of_days,
        amount: payload.amount,
      };
      return await createStripeLink.stripeLink(
        findJob.title,
        payload.amount,
        successUrl,
        cancelUrl,
        meteData
      );
    }

    if (payload.type === 'paypal') {
      return await createPaypalLink.paypalLink(findJob, payload);
    }

    if (payload.type === 'coinbase') {
      return await createCoinbaseLink.coinbaseLink(findJob, payload);
    }
  } catch (err) {
    throw Error(err);
  }
};

const payForCampaign = async (applicationId,jobId, amount, token) => {
  const successUrl = `${FRONTEND_URL}/employer/applications/${jobId}?token=${token}&status=true&type=payment&payment=true&campaign=true`;
  const cancelUrl = `${FRONTEND_URL}/employer/applications/${jobId}?token=${token}&status=false&type=payment&payment=true&campaign=true`;
  const meteData = {
    jobId,
    amount,
    campaign: true,
    applicationId,
  };
  return createStripeLink.stripeLink(
    'Campaign payment',
    amount,
    successUrl,
    cancelUrl,
    meteData
  );
};

const categories = async () => {
  try {
    return await models.JobCategory.findAll({
      attributes: {
        include: [
          [
            Sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM "Jobs" AS job
                    WHERE
                        job."categoryId" = "JobCategory".id
                )`),
            'jobsCount',
          ],
        ],
      },
      include: [
        {
          model: models.Subcategory,
          as: 'subCategories',
        },
        {
          model: models.Job,
          attributes: [],
          as: 'jobs',
          required: false,
        },
      ],
    });
  } catch (err) {
    throw Error(err);
  }
};

const getSubCategories = async () => {
  try {
    return await models.Subcategory.findAll();
  } catch (err) {
    throw Error(err);
  }
};

const getSubCategoriesById = async (categoryId) => {
  try {
    return await models.Subcategory.findAll({
      where: { categoryId },
    });
  } catch (err) {
    throw Error(err);
  }
};

const filter = async (params, limit, offset, userId = null) => {
  try {
    const whereStatement = {};
    const skillsKeys = {};

    const radiusFilter = models.Job.sequelize.and(
      params.latitude && params.longitude && params.distance
        ? Sequelize.where(
            Sequelize.literal(
              `6371 * acos(cos(radians(${params.latitude})) * cos(radians(latitude)) * cos(radians(${params.longitude}) - radians(longitude)) + sin(radians(${params.latitude})) * sin(radians(latitude)))`
            ),
            '<=',
            params.distance
          )
        : null
    );
    if (params.categoryId && params.categoryId.length > 0) {
      whereStatement.categoryId = parseInt(params.categoryId, 10);
    }
    if (params.subCategoryId) {
      whereStatement.subCategoryId = params.subCategoryId;
    }
    if (params.isPromoted) {
      if (params.isPromoted === true) {
        whereStatement.isPromoted = true;
      } else {
        whereStatement.isPromoted = false;
      }
    }
    if (params.jobType && params.jobType.length > 0)
      whereStatement.jobType = params.jobType;
    if (params.createdAt) {
      if (params.createdAt === '1h') {
        const dateTime = moment().subtract(1, 'hours').toDate();
        whereStatement.createdAt = {
          [Op.gte]: dateTime,
        };
      }

      if (params.createdAt === '24h') {
        const dateTime = moment().subtract(24, 'hours').toDate();
        whereStatement.createdAt = {
          [Op.gte]: dateTime,
        };
      }

      if (params.createdAt === '7d') {
        const dateTime = moment().subtract(7, 'days').toDate();
        whereStatement.createdAt = {
          [Op.gte]: dateTime,
        };
      }

      if (params.createdAt === '14d') {
        const dateTime = moment().subtract(14, 'days').toDate();
        whereStatement.createdAt = {
          [Op.gte]: dateTime,
        };
      }

      if (params.createdAt === '30d') {
        const dateTime = moment().subtract(30, 'days').toDate();
        whereStatement.createdAt = {
          [Op.gte]: dateTime,
        };
      }
    }
    if (params.salaryRangeMin && params.salaryRangeMax) {
      if (params.salaryRangeMax === 20000) {
        whereStatement[Op.or] = [
          {
            salaryRangeMin: {
              [Op.between]: [
                parseInt(params.salaryRangeMin, 10),
                parseInt(params.salaryRangeMax, 10),
              ],
            },
          },
          {
            salaryRangeMax: {
              [Op.gte]: 20000,
            },
          },
        ];
      } else {
        whereStatement[Op.or] = [
          {
            salaryRangeMin: {
              [Op.between]: [
                parseInt(params.salaryRangeMin, 10),
                parseInt(params.salaryRangeMax, 10),
              ],
            },
          },
          {
            salaryRangeMax: {
              [Op.between]: [
                parseInt(params.salaryRangeMin, 10),
                parseInt(params.salaryRangeMax, 10),
              ],
            },
          },
        ];
      }
    }
    if (params.name) {
      whereStatement.name = { [Op.iLike]: `%${params.name}%` };
    }
    if (params.location) {
      whereStatement.location = { [Op.iLike]: `%${params.location}%` };
    }
    if (params.skills && params.skills.length > 0) {
      skillsKeys.name = params.skills;
    }
    return await models.Job.findAndCountAll({
      where: { [Op.and]: [whereStatement, radiusFilter] },
      limit,
      offset,
      distinct: true,
      include: [
        {
          model: models.Hashtag,
          as: 'Hashtags',
          where: skillsKeys,
        },
        {
          model: models.JobCategory,
          as: 'Category',
        },
        {
          model: models.Subcategory,
          as: 'SubCategory',
        },
        {
          model: models.User,
          as: 'User',
        },
        {
          model: models.JobApplication,
          as: 'JobApplications',
          where: userId ? { userId } : { id: 0 },
          required: false,
        },
        {
          model: models.Bookmark,
          as: 'Bookmarks',
          where: userId ? { userId, jobId: { [Op.col]: 'Job.id' } } : { id: 0 },
          required: false,
        },
      ],
    });
  } catch (err) {
    throw Error(err);
  }
};

const searchJobs = async (query, userId = null, limit, offset) => {
  try {
    const searchResults = await models.sequelize.query(
      `
     SELECT 
    j.id,
    j."categoryId",
    j."subCategoryId",
    j.name,
    j.location,
    j.description,
    j.title,
    j."jobType",
    j.experience,
    j.qualification,
    j.responsibilities,   
    h,sc,c
    FROM "${models.Job.tableName}" AS j
    LEFT JOIN "${models.JobHashtag.tableName}" AS jh ON j.id = jh."jobId"
    LEFT JOIN "${models.Hashtag.tableName}" AS h ON jh."hashtagId" = h.id
    LEFT JOIN "${models.JobCategory.tableName}" AS c ON j."categoryId" = c.id
    LEFT JOIN "${models.User.tableName}" AS u ON j."userId" = u.id
    LEFT JOIN "${models.Subcategory.tableName}" AS sc ON j."subCategoryId" = sc.id
    WHERE to_tsvector(concat_ws(' ',
    j.name,
    j.location,
    j.description,
    j.title,
    j."jobType",
    j.experience,
    j.qualification,
    j.responsibilities,
    h.name, c.name, sc.name, u."companyName", u.benefits, u.website)) @@ plainto_tsquery('english', :query);
    `,
      {
        model: models.Job,
        replacements: { query },
      }
    );
    return getJobsByIds(
      [...new Set(searchResults.map((job) => job.id))],
      userId,
      limit,
      offset
    );
  } catch (err) {
    throw Error(err);
  }
};

const getApplicationsByJobId = async (jobId, limit, offset) => {
  try {
    const applications = await models.JobApplication.findAndCountAll({
      where: { jobId },
      limit,
      offset,
      distinct: true,
      include: [
        {
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
              model: models.Resume,
              as: 'Resumes',
            },
          ],
        },
        {
          model: models.Job,
          as: 'Job',
        },
      ],
    });
    return applications;
  } catch (err) {
    throw Error(err);
  }
};

const allJobApplications = async (userId, status, limit, offset) => {
  try {
    const whereStatement = {};
    if (status) {
      whereStatement.status = status;
    }
    const res = await models.JobApplication.findAndCountAll({
      limit,
      offset,
      distinct: true,
      where: whereStatement,
      include: [
        {
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
              model: models.Resume,
              as: 'Resumes',
            },
          ],
        },
        {
          model: models.Job,
          as: 'Job',
          where: { userId },
          include: [
            {
              model: models.Hashtag,
              as: 'Hashtags',
            },
          ],
        },
      ],
    });
    const rows = [];
    res.rows.map((item) => {
      let totalScore = 0;
      let matched = 0;
      const jobSkills = {};
      item.Job.Hashtags.map(
        (hashtag) => (jobSkills[hashtag.name] = hashtag.JobHashtag.years)
      );
      // eslint-disable-next-line array-callback-return
      item.User.Hashtags.map((hashtag) => {
        if (hashtag.name in jobSkills) {
          totalScore +=
            (hashtag.UserHashtag.years / jobSkills[hashtag.name]) * 100;
          matched += 1;
        }
      });
      const obj = { ...item.dataValues, score: totalScore / matched ?? 0 };
      return rows.push(obj);
    });

    const { count } = res;
    return { count, rows };
  } catch (err) {
    throw Error(err);
  }
};

const getApplication = async (id) => {
  try {
    const applications = await models.JobApplication.findByPk(id, {
      include: [
        {
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
              model: models.Resume,
              as: 'Resumes',
            },
          ],
        },
        {
          model: models.Job,
          as: 'Job',
        },
      ],
    });
    return applications;
  } catch (err) {
    throw Error(err);
  }
};

const updateApplicationStatus = async (id, payload) => {
  try {
    const application = await models.JobApplication.update(payload, {
      where: { id },
      returning: true,
    });
    return application;
  } catch (err) {
    throw Error(err);
  }
};

const webhook = async (payload) => {
  try {
    if (payload.metadata.campaign) {
      const findApplication = await getApplication(
        payload.metadata.applicationId
      );
      if (findApplication.status === 'HIRED') {
        throw Error('You cannot update a hired application');
      }

      const application = await updateApplicationStatus(
        payload.metadata.applicationId,
        { status: 'HIRED' }
      );
      // if (findApplication.status === 'HIRED') {
        await splitCampaign.split(payload.metadata.applicationId);
        const notificationPayload = {
          userId: application.userId,
          action: `Congratulation, you have been hired for the role of ${findApplication.Job.title}`,
          link: `${FRONTEND_URL}/jobs/${findApplication.Job.id}`,
        };
        await NotificationService.addNotification(notificationPayload);
        const notifications = await NotificationService.getNotifications(
          findApplication.userId
        );
        io.emit('get_notifications', notifications);
      // }
    } else {
      const checkJob = await getJob(payload.metadata.jobId);
      if (!checkJob.isPromoted) {
        await updateJob(parseInt(payload.metadata.jobId, 10), {
          isPromoted: true,
          numberOfDays: payload.metadata.number_of_days,
          promotionAmountPerDay:
            payload.metadata.amount / payload.metadata.number_of_days,
          promotionEndDate: moment()
            .add(payload.metadata.number_of_days, 'days')
            .format('YYYY-MM-DD'),
        });
      }
    }
  } catch (err) {
    console.log(err);
    // throw Error(err);
  }
};

const applyToJob = async (payload) => {
  try {
    const application = await models.JobApplication.create(payload);
    return getApplication(application.id);
  } catch (err) {
    throw Error(err);
  }
};

const findApplication = async (payload) => {
  try {
    const application = await models.JobApplication.findOne({
      where: { userId: payload.userId, jobId: payload.jobId },
    });
    return application;
  } catch (err) {
    throw Error(err);
  }
};

const appliedJobs = async (userId, status = null, limit, offset) => {
  try {
    const whereStatement = { userId };
    if (status) {
      whereStatement.status = status;
    }
    const applications = await models.JobApplication.findAndCountAll({
      where: whereStatement,
      limit,
      offset,
      distinct: true,
      include: [
        {
          model: models.Job,
          as: 'Job',
          include: [
            {
              model: models.Hashtag,
              as: 'Hashtags',
            },
            {
              model: models.JobCategory,
              as: 'Category',
            },
            {
              model: models.Subcategory,
              as: 'SubCategory',
            },
            {
              model: models.User,
              as: 'User',
            },
          ],
          attributes: {
            include: [
              [
                Sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM "JobApplications" AS application
                    WHERE
                        application."jobId" = "Job"."id"
                )`),
                'JobApplicationsCount',
              ],
            ],
          },
        },
      ],
    });
    return applications;
  } catch (err) {
    throw Error(err);
  }
};

// const sendMailAccepted = async (id) => {
//   try {
//     const fetchApplication = await getApplication(id);
//     console.log(fetchApplication);
//     // create reusable transporter object using the default SMTP transport
//     const transporter = nodemailer.createTransport({
//       host: 'smtp.gmail.com',
//       port: 465,
//       secure: true, // true for 465, false for other ports
//       auth: {
//         user: 'jobhunter@gmail.com', // generated ethereal user
//         pass: 'phddxevizdfhjdshjckmkj', // generated ethereal password
//       },
//     });

//     // send mail with defined transport object
//     const info = await transporter.sendMail({
//       from: '"Job hunter 👻" <jobhunter@gmail.com>', // sender address
//       to: 'jobhunter@gmail.com', // list of receivers
//       subject: 'Hello ✔', // Subject line
//       text: 'Hello world?', // plain text body
//       html: `<b>Hi, ${fetchApplication.User.fullName}, Your Application to  ${fetchApplication.Job.title} was accepted and we will like to invite you to an interview.</b>`, // html body
//     });

//     console.log('Message sent: %s', info.messageId);
//     // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
//   } catch (err) {
//     throw Error(err);
//   }
// };
const bookmarkJob = async (payload) => {
  try {
    const bookmark = await models.Bookmark.create(payload);
    return bookmark;
  } catch (err) {
    throw Error(err);
  }
};

const deleteBookmarkedJob = async (payload) => {
  try {
    const { userId, jobId } = payload;
    const bookmark = await models.Bookmark.destroy({
      where: { userId, jobId },
    });
    return bookmark;
  } catch (err) {
    throw Error(err);
  }
};

const findBookmark = async (payload) => {
  try {
    const bookmark = await models.Bookmark.findOne({
      where: { userId: payload.userId, jobId: payload.jobId },
    });
    return bookmark;
  } catch (err) {
    throw Error(err);
  }
};

const bookmarksCount = async (userId) => {
  try {
    const count = await models.Bookmark.count({ where: { userId } });
    return count;
  } catch (err) {
    throw Error(err);
  }
};

const bookmarks = async (userId, limit, offset) => {
  try {
    const bookmark = await models.Bookmark.findAndCountAll({
      where: { userId },
      limit,
      offset,
      distinct: true,
      include: [
        {
          model: models.Job,
          as: 'Job',
          include: [
            {
              model: models.Hashtag,
              as: 'Hashtags',
            },
            {
              model: models.JobCategory,
              as: 'Category',
            },
            {
              model: models.Subcategory,
              as: 'SubCategory',
            },
            {
              model: models.User,
              as: 'User',
            },
            {
              model: models.JobApplication,
              as: 'JobApplications',
              where: userId ? { userId } : { id: 0 },
              required: false,
            },
          ],
        },
        {
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
              model: models.Resume,
              as: 'Resumes',
            },
          ],
        },
      ],
    });
    return bookmark;
  } catch (err) {
    throw Error(err);
  }
};

const getLatestJobs = async () => {
  try {
    const jobs = await models.Job.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: models.Hashtag,
          as: 'Hashtags',
        },
        {
          model: models.JobCategory,
          as: 'Category',
        },
        {
          model: models.Subcategory,
          as: 'SubCategory',
        },
        {
          model: models.User,
          as: 'User',
        },
      ],
    });
    return jobs;
  } catch (err) {
    throw Error(err);
  }
};

const getJobsByStatus = async (
  limit,
  offset,
  status = 'ACTIVE',
  userId = null
) => {
  try {
    const whereStatement = { status };
    if (userId) {
      whereStatement.userId = userId;
    }
    return await models.Job.findAndCountAll({
      where: { status },
      limit,
      offset,
      distinct: true,
      include: [
        {
          model: models.Hashtag,
          as: 'Hashtags',
        },
        {
          model: models.JobCategory,
          as: 'Category',
        },
        {
          model: models.Subcategory,
          as: 'SubCategory',
        },
        {
          model: models.User,
          as: 'User',
        },
        {
          model: models.JobApplication,
          as: 'JobApplications',
          where: userId ? { userId } : { id: 0 },
          required: false,
        },
        {
          model: models.Bookmark,
          as: 'Bookmarks',
          where: userId ? { userId, jobId: { [Op.col]: 'Job.id' } } : { id: 0 },
          required: false,
        },
      ],
    });
  } catch (err) {
    throw Error(err);
  }
};

export default {
  createJob,
  addJobHashtag,
  getJob,
  getJobs,
  getFeaturedJobs,
  getJobsByIds,
  updateJob,
  deleteJob,
  promoteJob,
  payForCampaign,
  webhook,
  categories,
  getSubCategories,
  getSubCategoriesById,
  filter,
  searchJobs,
  applyToJob,
  findApplication,
  getApplicationsByJobId,
  allJobApplications,
  getApplication,
  updateApplicationStatus,
  // sendMailAccepted,
  bookmarkJob,
  deleteBookmarkedJob,
  findBookmark,
  bookmarks,
  bookmarksCount,
  appliedJobs,
  getLatestJobs,
  getJobsByStatus,
};
