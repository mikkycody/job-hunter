import models from '../models';

const getAffiliates = async (userId, limit, offset) => {
  try {
    const res = await models.JobReferral.findAndCountAll({
      where: { userId },
      limit,
      offset,
      distinct: true,
      include: [
        {
          model: models.JobApplication,
          as: 'JobApplication',
          include: [
            {
              model: models.Job,
              as: 'Job',
              attributes: ['id', 'title', 'location', 'jobType'],
            },

            {
              model: models.User,
              as: 'User',
              attributes: ['fullName', 'username'],
            },
          ],
        },
      ],
    });

    const rows = res.rows.map((item) => ({
      id: item.id,
      username: item.JobApplication.User.username,
      jobTitle: item.JobApplication.Job.title,
      jobLocation: item.JobApplication.Job.location,
      jobType: item.JobApplication.Job.jobType,
      status: item.JobApplication.status,
    }));

    const { count } = res;
    return { count, rows };
  } catch (err) {
    throw Error(err);
  }
};

const getAffiliatePayments = async (userId, limit, offset) => {
  try {
    const res = await models.Account.findAndCountAll({
      where: { userId, jobReferralId: { [models.Sequelize.Op.not]: null } },
      limit,
      offset,
      distinct: true,
      include: [
        {
          model: models.JobReferral,
          as: 'JobReferral',
          include: [
            {
              model: models.JobApplication,
              as: 'JobApplication',
              include: [
                {
                  model: models.Job,
                  as: 'Job',
                  attributes: ['id', 'title', 'location', 'jobType'],
                },
                {
                  model: models.User,
                  as: 'User',
                  attributes: ['fullName', 'username'],
                },
              ],
            },
          ],
        },
      ],
    });

    const rows = res.rows.map((item) => ({
      id: item.id,
      reference: item.reference,
      narration: item.narration,
      amount: item.credit,
      username: item.JobReferral.JobApplication.User.username,
      jobTitle: item.JobReferral.JobApplication.Job.title,
      jobLocation: item.JobReferral.JobApplication.Job.location,
      jobType: item.JobReferral.JobApplication.Job.jobType,
      date: item.createdAt,
    }));

    const { count } = res;
    return { rows, count };
  } catch (err) {
    throw Error(err);
  }
};

export default { getAffiliates, getAffiliatePayments };
