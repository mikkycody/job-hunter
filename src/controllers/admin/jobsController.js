/* eslint-disable consistent-return */
import jobServices from '../../services/jobsServices';
import { getPagination, getPagingData } from '../../helpers/paginationHelper';

const latestJobs = async ({ res }) => {
  try {
    const jobs = await jobServices.getLatestJobs();
    return res.status(200).json({
      jobs,
    });
  } catch (err) {
    res.status(500).json({
      error: err?.message,
    });
  }
};

const allJobs = async ( req , res ) => {
  try {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const data = await jobServices.getJobs(null, limit, offset);
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

const getApplicationsById = async (req, res) => {
  try {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const data = await jobServices.getApplicationsByJobId(
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

export default { latestJobs, allJobs, getApplicationsById };
