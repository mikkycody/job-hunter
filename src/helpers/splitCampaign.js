import { v4 as uuidv4 } from 'uuid';

import referralServices from '../services/referralServices';
import accountServices from '../services/accountServices';
import models from '../models';

const split = async (id) => {
  const getJobApplication = await models.JobApplication.findByPk(id, {
    include: [
      {
        model: models.Job,
        as: 'Job',
      },
    ],
  });
  const campaignAmount = getJobApplication.dataValues.Job.campaign;
  const findReferralByJobApplication =
    await referralServices.findReferralsByJobApplication(id);

  if (campaignAmount && campaignAmount > 0 && findReferralByJobApplication) {
    // credit referrer 50%,check if job application id exists in job referral table, if it does, get the user id of the referrer and credit
    await accountServices.store({
      userId: findReferralByJobApplication.dataValues.userId,
      credit: campaignAmount * 0.5,
      narration: `Affiliate payment for ${getJobApplication.dataValues.Job.title} referral`,
      jobReferralId: findReferralByJobApplication.dataValues.id,
      reference: uuidv4(),
    });

    // credit admin 30%
    await accountServices.store({
      userId: 1, // superadmin
      credit: campaignAmount * 0.3,
      narration: `Admin affiliate payment for ${getJobApplication.dataValues.Job.title} referral`,
      jobReferralId: findReferralByJobApplication.dataValues.id,
      reference: uuidv4(),
    });

    // credit the hired 20%,
    await accountServices.store({
      userId: getJobApplication.dataValues.userId, // hired user
      credit: campaignAmount * 0.2,
      narration: `My affiliate payment for ${getJobApplication.dataValues.Job.title} hire`,
      jobReferralId: findReferralByJobApplication.dataValues.id,
      reference: uuidv4(),
    });

    // credit the hired 20%,
    await accountServices.store({
      userId: getJobApplication.dataValues.Job.userId, // employer cashback
      credit: campaignAmount * 0.1,
      narration: `Employer affiliate cashback for ${getJobApplication.dataValues.Job.title} referral`,
      jobReferralId: findReferralByJobApplication.dataValues.id,
      reference: uuidv4(),
    });
  }
};

export default { split };
