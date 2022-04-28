import { Op } from 'sequelize';
import models from '../models';

const getHomepageStats = async () => {
  try {
    const jobsCount = await models.Job.count();
    const resumesCount = await models.Resume.count();
    const candidatesCount = await models.User.count({
      include: [
        {
          model: models.Role,
          as: 'Roles',
          where: { id: 2 },
        },
      ],
    });
    const companiesCount = await models.User.count({
      include: [
        {
          model: models.Role,
          as: 'Roles',
          where: { id: 1 },
        },
      ],
    });
    return { companiesCount, candidatesCount, jobsCount, resumesCount };
  } catch (err) {
    throw new Error(err);
  }
};


const candidateDashboard = async (userId) => {
  try {
    const interviewsCount = await models.Interview.count({ where: { userId } });
    const applicationsCount = await models.JobApplication.count({
      where: { userId },
    });
    const pendingInterviewsCount = await models.Interview.count({
      where: { userId, status: 'COMPLETED' },
    });
    const profileViewsCount = await models.ProfileView.count({
      where: { userId },
    });

    return {
      interviewsCount,
      applicationsCount,
      pendingInterviewsCount,
      profileViewsCount,
    };
  } catch (err) {
    throw new Error(err);
  }
};

const appliedJobs = async (userId) => {
  try {
    const applicationsCount = await models.JobApplication.count({
      where: { userId },
    });

    const declinedApplicationsCount = await models.JobApplication.count({
      where: { userId, status: 'DECLINED' },
    });

    const ongoingApplicationsCount = await models.JobApplication.count({
      where: { userId, [Op.not]: [{ status: ['HIRED', 'DECLINED'] }] },
    });

    return {
      applicationsCount,
      declinedApplicationsCount,
      ongoingApplicationsCount,
    };
  } catch (err) {
    throw new Error(err);
  }
};

const appliedJobsForEmployer = async (userId) => {
  try {
    const applicationsCount = await models.JobApplication.count({
      include: [
        {
          model: models.Job,
          as: 'Job',
          where: { userId },
        },
      ],
    });

    const declinedApplicationsCount = await models.JobApplication.count({
      where: { status: 'DECLINED' },
      include: [
        {
          model: models.Job,
          as: 'Job',
          where: { userId },
        },
      ],
    });

    const ongoingApplicationsCount = await models.JobApplication.count({
      where: { [Op.not]: [{ status: ['HIRED', 'DECLINED'] }] },
      include: [
        {
          model: models.Job,
          as: 'Job',
          where: { userId },
        },
      ],
    });

    return {
      applicationsCount,
      declinedApplicationsCount,
      ongoingApplicationsCount,
    };
  } catch (err) {
    throw new Error(err);
  }
};

const affiliates = async (userId) => {
  try {
    const totalAffiliates = await models.JobReferral.count({
      where: { userId },
    });

    const acceptedAffiliates = await models.JobApplication.findAndCountAll({
      distinct: true,
      where: { status: 'HIRED' },
      include: [
        {
          model: models.JobReferral,
          as: 'JobReferral',
          where: { userId },
        },
      ],
    });

    // const getEarnings = await models.JobApplication.findAll({
    //   where: { status: 'HIRED' },
    //   include: [
    //     {
    //       model: models.JobReferral,
    //       as: 'JobReferral',
    //       where: { userId },
    //     },
    //     {
    //       model: models.Job,
    //       as: 'Job',
    //       where: { campaign: { [Op.gt]: 0 } },
    //     },
    //   ],
    // });

    // const earnings =
    //   getEarnings.length > 0
    //     ? getEarnings
    //         .map((res) => res.Job.campaign)
    //         .reduce((total, value) => total + value)
    //     : 0;
    const earnings = await models.Account.sum('credit', {
      where: { userId, jobReferralId: { [Op.ne]: null } },
    });

    return {
      totalAffiliates,
      acceptedAffiliates: acceptedAffiliates.count,
      earnings,
    };
  } catch (err) {
    throw new Error(err);
  }
};

const employerDashboard = async (userId) => {
  try {
    const totalJobs = await models.Job.count({ where: { userId } });
    const applicationsSubmitted = await models.JobApplication.count({
      include: [
        {
          model: models.Job,
          as: 'Job',
          where: { userId },
        },
      ],
    });
    const activeJobs = await models.Job.count({
      where: { userId, status: 'ACTIVE' },
    });
    const inactiveJobs = await models.Job.count({
      where: { userId, status: 'INACTIVE' },
    });

    return {
      totalJobs,
      applicationsSubmitted,
      activeJobs,
      inactiveJobs,
    };
  } catch (err) {
    throw new Error(err);
  }
};

const adminDashboard = async () => {
  try {
    const totalUsers = await models.User.count();
    const totalEmployers = await models.User.count({
      include: [
        {
          model: models.Role,
          as: 'Roles',
          where: { id: 2 },
        },
      ],
    });

    const totalCandidates = await models.User.count({
      include: [
        {
          model: models.Role,
          as: 'Roles',
          where: { id: 1 },
        },
      ],
    });

    const totalJobs = await models.Job.count();

    return {
      totalUsers,
      totalEmployers,
      totalCandidates,
      totalJobs,
    };
  } catch (err) {
    throw new Error(err);
  }
};

export default {
  getHomepageStats,
  candidateDashboard,
  appliedJobs,
  appliedJobsForEmployer,
  affiliates,
  employerDashboard,
  adminDashboard,
};
