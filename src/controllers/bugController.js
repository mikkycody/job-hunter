import BugService from '../services/bugServices';
import validateBug from '../helpers/validateBug';

const storeBug = async (req, res) => {
  try {
    const { error } = validateBug(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }
    const bug = await BugService.create(req.body);
    return res.status(201).json(bug);
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

export default { storeBug };
