import statsServices from '../services/statsServices';

const homepage = async (req, res) => {
  try {
    const stats = await statsServices.getHomepageStats();
    return res.status(200).json({
      stats,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

const candidateDashboard = async (req, res) => {
  try {
    const stats = await statsServices.candidateDashboard(req.user.id);
    return res.status(200).json({
      stats,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

const appliedJobs = async (req, res) => {
  try {
    let stats = {};
    if (req.user.roles.find((obj) => obj.id === 2)) {
      stats = await statsServices.appliedJobsForEmployer(req.user.id);
    } else {
      stats = await statsServices.appliedJobs(req.user.id);
    }
    return res.status(200).json({
      stats,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

const affiliates = async (req, res) => {
  try {
    const stats = await statsServices.affiliates(req.user.id);
    return res.status(200).json({
      stats,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

const employerDashboard = async (req, res) => {
  try {
    const stats = await statsServices.employerDashboard(req.user.id);
    return res.status(200).json({
      stats,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

const adminDashboard = async (req, res) => {
  try {
    const stats = await statsServices.adminDashboard(req.user.id);
    return res.status(200).json({
      stats,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

export default {
  homepage,
  candidateDashboard,
  appliedJobs,
  affiliates,
  employerDashboard,
  adminDashboard,
};
