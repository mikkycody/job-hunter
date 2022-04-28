import models from '../models';

const uri = require('url');

const createInterview = async (payload) => {
  const url = payload.event;
  const jobId = new URL(url).searchParams.get('jobId');
  const userId = new URL(url).searchParams.get('userId');
  const interview = await models.Interview.create({
    jobId,
    userId,
    url,
    cancelUrl: payload.cancel_url,
    rescheduleUrl: payload.reschedule_url,
    status: payload.status,
  });
  return interview;
};

const cancelInterview = async (payload) => {
  const { status } = payload;
  const url = payload.event;
  const jobId = new URL(url).searchParams.get('jobId');
  const userId = new URL(url).searchParams.get('userId');
  const interview = await models.Interview.update(status, {
    where: { jobId, userId },
  });
  return interview;
};

const getInterviews = async (userId) => {
  const interviews = await models.Interview.findAll({
    where: { userId },
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
  return interviews;
};

export default { createInterview, cancelInterview, getInterviews };
