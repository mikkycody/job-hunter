import hashtagServices from '../services/hashtagServices';
/**
 * This method gets a list of jobs
 * @param {object} req
 * @param {object} res
 * @returns a response object with jobs list
 */
const getHashtags = async (req, res) => {
  try {
    const hashtags = await hashtagServices.getHashtags();
    return res.status(200).json({
      hashtags,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

export default { getHashtags };
