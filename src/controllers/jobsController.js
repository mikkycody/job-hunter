/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';
import validateCreateJob from '../helpers/validateCreateJob';
import validateUpdateJob from '../helpers/validateUpdateJob';
import hashtagServices from '../services/hashtagServices';
import jobsServices from '../services/jobsServices';
import userServices from '../services/userServices';
import validateJobPromotion from '../helpers/validateJobPromotion';
import validateJobApplication from '../helpers/validateJobApplication';
import validateStatusUpdate from '../helpers/validateStatusUpdate';
import referralServices from '../services/referralServices';
import { getPagination, getPagingData } from '../helpers/paginationHelper';
import NotificationService from '../services/notificationServices';
import { FRONTEND_URL } from '../config/constants';

// import Logger from '../../logger';

const stripe = require('stripe')(process.env.STRIPE_SECRET);

/**
 * This method creates a new job
 * @param {object} req
 * @param {object} res
 * @returns a res object with job detail
 */
const createJob = async (req, res) => {
  const { error } = validateCreateJob(req.body);
  req.body.userId = req.user.id;

  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }
  try {
    const job = await jobsServices.createJob(req.body);
    let { hashtags } = req.body;
    if (hashtags) {
      const pivotArray = [];
      const years = hashtags.map((hashtag) => hashtag.years);
      const names = hashtags.map((hashtag) => hashtag.name);
      hashtags = await hashtagServices.findOrCreateHashtags(names);
      const tagIds = await hashtags.map((tag) => tag.dataValues.id);
      for (let i = 0; i < tagIds.length; i += 1) {
        pivotArray.push({
          jobId: job.dataValues.id,
          hashtagId: tagIds[i],
          years: years[i],
        });
      }
      await jobsServices.addJobHashtag(pivotArray);
    }
    const jobResult = await jobsServices.getJob(job.dataValues.id);
    return res.status(201).json({
      job: jobResult,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

/**
 * This method upates a  job
 * @param {object} req
 * @param {object} res
 * @returns a res object with job detail
 */
const updateJob = async (req, res) => {
  const { error } = validateUpdateJob(req.body);
  req.body.userId = req.user.id;
  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }
  try {
    const findJob = await jobsServices.getJob(req.params.id);
    if (
      !findJob ||
      findJob.userId !== req.body.userId
    ) {
      return res.status(400).json({
        error:
          'Something went wrong, Please confirm you have the permission to update the job, and this job exists.',
      });
    }
    if (findJob.status === 'INACTIVE' && req.body.status !== 'ACTIVE') {
      return res.status(400).json({
        error: 'This job is inactive.',
      });
    }
    const updatedJob = await jobsServices.updateJob(req.params.id, req.body);
    let { hashtags } = req.body;
    if (hashtags) {
      const pivotArray = [];
      const years = hashtags.map((hashtag) => hashtag.years);
      const names = hashtags.map((hashtag) => hashtag.name);
      hashtags = await hashtagServices.findOrCreateHashtags(names);
      const tagIds = await hashtags.map((tag) => tag.dataValues.id);
      for (let i = 0; i < tagIds.length; i += 1) {
        pivotArray.push({
          jobId: req.params.id,
          hashtagId: tagIds[i],
          years: years[i],
        });
      }
      await jobsServices.addJobHashtag(pivotArray);
    }
    const job = await jobsServices.getJob(updatedJob[1][0].id);

    return res.status(200).json({
      job,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

/**
 * This method gets a  job
 * @param {object} req
 * @param {object} res
 * @returns a res object with job detail
 */
const getJob = async (req, res) => {
  try {
    const token = req?.headers?.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    }
    const job = await jobsServices.getJob(
      req.params.id,
      req.user ? req.user.id : null
    );
    return res.status(200).json({
      job,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

/**
 * This method gets a list of jobs
 * @param {object} req
 * @param {object} res
 * @returns a res object with jobs list
 */
const getJobs = async (req, res) => {
  try {
    const token = req?.headers?.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    }
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const data = await jobsServices.getJobs(
      req.user ? req.user.id : null,
      req.query.status ?? null,
      limit,
      offset
    );
    const jobs = getPagingData(data, page, limit);
    return res.status(200).json({
      jobs,
    });
  } catch (err) {
    res.status(500).json({
      error: err?.message,
    });
  }
};

/**
 * This method gets a list of n featured jobs
 * @param {object} req
 * @param {object} res
 * @returns a res object with jobs list
 */
const getFeaturedJobs = async (req, res) => {
  try {
    const token = req?.headers?.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    }
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const data = await jobsServices.getFeaturedJobs(
      req.user ? req.user.id : null,
      limit,
      offset
    );
    const jobs = getPagingData(data, page, limit);
    return res.status(200).json({
      jobs,
    });
  } catch (err) {
    res.status(500).json({
      error: err?.message,
    });
  }
};

/**
 * This method deletes a  job
 * @param {object} req
 * @param {object} res
 */
const deleteJob = async (req, res) => {
  try {
    const findJob = await jobsServices.getJob(req.params.id);
    if (!findJob || findJob.userId !== req.user.id) {
      return res.status(400).json({
        error:
          'Something went wrong, Please confirm you have the permission to delete the job and this job exists.',
      });
    }
    const jobs = await jobsServices.deleteJob(req.params.id);
    return res.status(200).json({
      jobs,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

/**
 * This method promotes a job
 * @param {object} req
 * @param {object} res
 */
const promoteJob = async (req, res) => {
  try {
    const { error } = validateJobPromotion(req.body);
    // eslint-disable-next-line prefer-destructuring
    req.body.token = req.headers.authorization.split(' ')[1];
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }
    const findJob = await jobsServices.getJob(req.params.id);
    if (!findJob || findJob.userId !== req.user.id) {
      return res.status(400).json({
        error:
          'Something went wrong, Please confirm you have the permission to update the job and this job exists.',
      });
    }
    if (findJob.status === 'INACTIVE') {
      return res.status(400).json({
        error:
          'This job is inactive.',
      });
    }
    if (findJob.isPromoted) {
      return res.status(400).json({
        error: 'This job has already been promoted.',
      });
    }
    const url = await jobsServices.promoteJob(req.params.id, req.body);
    return res.status(200).json({
      url,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

/**
 * This method pays for a job campaign
 * @param {object} req
 * @param {object} res
 */
const payForCampaign = async (req, res) => {
  try {
    // eslint-disable-next-line prefer-destructuring
    const application = await jobsServices.getApplication(req.params.id);
    if (!application || application.Job.userId !== req.user.id) {
      return res.status(400).json({
        error:
          'Something went wrong, Please confirm you have the permission to perform this action.',
      });
    }
    const url = await jobsServices.payForCampaign(
      application.id,
      application.Job.id,
      application.Job.campaign,
      req.headers.authorization.split(' ')[1]
    );
    return res.status(200).json({
      url,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

/**
 * This method receives webhook from stripe
 * @param {object} req
 * @param {object} res
 */
const promoteJobStripeWebhook = async (req, res) => {
  const endpointSecret = process.env.SIGN_SECREET;
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'charge.succeeded':
      // const charge = event.data.object;
      await jobsServices.webhook(event.data.object);
      // Then define and call a function to handle the event charge.succeeded
      break;
    // ... handle other event types
    default:
    // Logger.info(`Unhandled event type ${event.type}`);
    // console.info(`Unhandled event type ${event.type}`);
  }
  // Return a 200 res to acknowledge receipt of the event
  res.send();
};

/**
 * This method receives webhook from stripe
 * @param {object} req
 * @param {object} res
 */
const promoteJobCoinbaseWebhook = async (req, res) => {
  // if (request.headers['X-Forwarded-For'] >= (54.175.255.192) && request.headers['X-Forwarded-For'] <= 54.175.255.223){
  const { event } = req.body;
  // Handle the event
  switch (event.type) {
    case 'charge:confirmed':
      await jobsServices.webhook(event);
      break;
    // ... handle other event types
    default:
    // Logger.info(`Unhandled event type ${event.type}`);
    // console.info(`Unhandled event type ${event.type}`);
  }
  // Return a 200 res to acknowledge receipt of the event
  res.send();
};

/**
 * This method reeturns job categories and related jobs count
 * @param {object} res
 */
const getCategories = async ({ res }) => {
  try {
    const categories = await jobsServices.categories();
    return res.status(200).json({
      categories,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

/**
 * This method sub categories
 * @param {object} res
 */
const getSubCategories = async (req, res) => {
  try {
    const subCategories = await jobsServices.getSubCategories();
    return res.status(200).json({
      subCategories,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

/**
 * This method reeturns job sub categories by id
 * @param {object} res
 */
const getSubCategoriesById = async (req, res) => {
  try {
    const subCategories = await jobsServices.getSubCategoriesById(
      req.params.id
    );
    return res.status(200).json({
      subCategories,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};
/**
 * This method returns filtered job
 * @param {object} req
 * @param {object} res
 */
const filterJobs = async (req, res) => {
  try {
    const token = req?.headers?.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    }
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const data = await jobsServices.filter(
      req.body,
      limit,
      offset,
      req.user ? req.user.id : null
    );
    const jobs = getPagingData(data, page, limit);
    return res.status(200).json({
      jobs,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

/**
 * This method gets a list of jobs
 * @param {object} req
 * @param {object} res
 * @returns a res object with jobs list
 */
const searchJobs = async (req, res) => {
  try {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const data = await jobsServices.searchJobs(
      req.query.query,
      req.user ? req.user.id : null,
      limit,
      offset
    );
    const jobs = getPagingData(data, page, limit);
    return res.status(200).json({
      jobs,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

/**
 * This method handles job application
 * @param {object} req
 * @param {object} res
 * @returns a res object with jobs list
 */
const applyToJob = async (req, res) => {
  try {
    const { error } = validateJobApplication(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }
    const findJob = await jobsServices.getJob(req.params.id);
    if (!findJob) {
      return res.status(400).json({
        error:
          'Something went wrong, Please confirm you have the permission to apply for this job and this job exists.',
      });
    }
    if (findJob.userId === req.user.id) {
      return res.status(400).json({
        error: 'You can not apply to your job :)',
      });
    }
    req.body.userId = req.user.id;
    req.body.jobId = req.params.id;
    req.body.status = 'PENDING';
    const findApplication = await jobsServices.findApplication({
      userId: req.body.userId,
      jobId: req.body.jobId,
    });
    if (findApplication) {
      return res.status(409).json({
        error: 'You applied to this job already.',
      });
    }
    const application = await jobsServices.applyToJob(req.body);
    const referrer = req.body.referrer ?? null;
    // Add referrer
    if (
      findJob.dataValues.campaign &&
      referrer &&
      referrer !== req.user.username
    ) {
      const findUser = await userServices.getUserByUsername(referrer);
      if (findUser) {
        await referralServices.jobReferrer({
          userId: findUser.dataValues.id,
          jobApplicationId: application.dataValues.id,
        });
      }
    }
    const notificationPayload = {
      userId: req.user.id,
      action: `You applied to ${findJob.dataValues.title}`,
      link: `${FRONTEND_URL}/jobs/${findJob.dataValues.id}`,
    };
    await NotificationService.addNotification(notificationPayload);
    const notifications = await NotificationService.getNotifications(
      req.user.id
    );
    io.emit('get_notifications', notifications);
    const employerNotificationPayload = {
      userId: findJob.dataValues.userId,
      action: `${req.user.username} applied to your ${findJob.dataValues.title} job`,
      link: `${FRONTEND_URL}/jobs/${findJob.dataValues.id}`,
    };
    await NotificationService.addNotification(employerNotificationPayload);
    const employerNotifications = await NotificationService.getNotifications(
      findJob.dataValues.userId
    );
    io.emit('get_notifications', employerNotifications);
    return res.status(200).json({
      application,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

/**
 * This method gets a list of a job application
 * @param {object} req
 * @param {object} res
 * @returns a res object with jobs list
 */

const jobApplications = async (req, res) => {
  try {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const data = await jobsServices.getApplicationsByJobId(
      req.params.id,
      limit,
      offset
    );
    const applications = getPagingData(data, page, limit);
    return res.status(200).json({
      applications,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

const allJobApplications = async (req, res) => {
  try {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const data = await jobsServices.allJobApplications(
      req.user.id,
      req.query.status ?? null,
      limit,
      offset
    );
    const applications = getPagingData(data, page, limit);
    return res.status(200).json({
      applications,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

/**
 * This method gets a job application
 * @param {object} req
 * @param {object} res
 * @returns a res object with jobs list
 */

const getApplication = async (req, res) => {
  try {
    await jobsServices.updateApplicationStatus(req.params.id, {
      status: 'VIEWED',
    });

    const application = await jobsServices.getApplication(req.params.id);
    const notificationPayload = {
      userId: application.userId,
      action: `Your application for ${application.Job.title} has been viewed`,
      link: `${FRONTEND_URL}/jobs/${application.Job.id}`,
    };
    await NotificationService.addNotification(notificationPayload);
    const notifications = await NotificationService.getNotifications(
      req.user.id
    );
    io.emit('get_notifications', notifications);
    return res.status(200).json({
      application,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

/**
 * This method updates a job application
 * @param {object} req
 * @param {object} res
 * @returns a res object with jobs list
 */

const updateApplication = async (req, res) => {
  try {
    const { error } = validateStatusUpdate(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    const findApplication = await jobsServices.getApplication(req.params.id);
    if (findApplication.status === 'HIRED') {
      return res.status(400).json({
        error: 'You cannot update a hired application',
      });
    }
    let application;
    if (req.body.status !== 'HIRED') {
      application = await jobsServices.updateApplicationStatus(
        req.params.id,
        req.body
      );
    }

    return res.status(200).json({
      application,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

/**
 * This method adds a job to bookmarks
 * @param {object} req
 * @param {object} res
 * @returns a res object with jobs list
 */

const bookmarkJob = async (req, res) => {
  try {
    if (!req.params.id || !Number.isInteger(parseInt(req.params.id, 10))) {
      return res.status(400).json({
        error: 'Please provide a job id',
      });
    }
    const findJob = await jobsServices.getJob(req.params.id);
    if (!findJob) {
      return res.status(400).json({
        error: 'Job not found',
      });
    }
    if (findJob.userId === req.user.id) {
      return res.status(400).json({
        error: 'You can not bookmark your job :)',
      });
    }
    const findBookmark = await jobsServices.findBookmark({
      jobId: req.params.id,
      userId: req.user.id,
    });
    if (findBookmark) {
      return res.status(409).json({
        error: 'You bookmarked this job already.',
      });
    }
    const bookmark = await jobsServices.bookmarkJob({
      jobId: req.params.id,
      userId: req.user.id,
    });
    return res.status(200).json({
      bookmark,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

/**
 * This method adds a job to bookmarks
 * @param {object} req
 * @param {object} res
 * @returns a res object with jobs list
 */

const deleteBookmarkedJob = async (req, res) => {
  try {
    if (!req.params.id || !Number.isInteger(parseInt(req.params.id, 10))) {
      return res.status(400).json({
        error: 'Please provide a job id',
      });
    }

    const findBookmark = await jobsServices.findBookmark({
      jobId: req.params.id,
      userId: req.user.id,
    });
    if (!findBookmark) {
      return res.status(409).json({
        error: 'You can not perform this action.',
      });
    }
    const bookmark = await jobsServices.deleteBookmarkedJob({
      jobId: req.params.id,
      userId: req.user.id,
    });
    return res.status(200).json({
      bookmark,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

/**
 * This method lists job added to bookmarks
 * @param {object} req
 * @param {object} res
 * @returns a res object with jobs list
 */

const getBookmarkedJobs = async (req, res) => {
  try {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const data = await jobsServices.bookmarks(req.user.id, limit, offset);
    const bookmarks = getPagingData(data, page, limit);
    return res.status(200).json({
      bookmarks,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

const getBookmarkedJobsCount = async (req, res) => {
  try {
    const bookmarksCount = await jobsServices.bookmarksCount(req.user.id);
    return res.status(200).json({
      bookmarksCount,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

const appliedJobs = async (req, res) => {
  try {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const data = await jobsServices.appliedJobs(
      req.user.id,
      req.query.status ?? null,
      limit,
      offset
    );
    const jobs = getPagingData(data, page, limit);
    return res.status(200).json({
      jobs,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

export default {
  createJob,
  getJob,
  getJobs,
  getFeaturedJobs,
  updateJob,
  deleteJob,
  promoteJob,
  payForCampaign,
  promoteJobStripeWebhook,
  promoteJobCoinbaseWebhook,
  getCategories,
  getSubCategories,
  getSubCategoriesById,
  filterJobs,
  searchJobs,
  applyToJob,
  jobApplications,
  allJobApplications,
  getApplication,
  updateApplication,
  bookmarkJob,
  getBookmarkedJobs,
  getBookmarkedJobsCount,
  appliedJobs,
  deleteBookmarkedJob,
};
