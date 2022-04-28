import languageServices from '../services/languageServices';
/**
 * This method gets a list of jobs
 * @param {object} req
 * @param {object} res
 * @returns a response object with jobs list
 */
const getLanguages = async (req, res) => {
  try {
    const languages = await languageServices.getLanguages();
    return res.status(200).json({
      languages,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

export default { getLanguages };
