import models from '../models';

const jobReferrer = async (payload) => {
  try {
    return await models.JobReferral.create(payload);
  } catch (err) {
    throw Error(err);
  }
};

const findReferralsByJobApplication = async (jobApplicationId) => {
  try {
    return await models.JobReferral.findOne({
      where: {jobApplicationId},
    });
  } catch (err) {
    throw Error(err);
  }
};

export default { jobReferrer, findReferralsByJobApplication };
