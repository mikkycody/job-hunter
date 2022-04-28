import bugServices from '../../services/bugServices';
import { getPagination, getPagingData } from '../../helpers/paginationHelper';

const getBugs = async (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  const data = await bugServices.getBugs(limit, offset);
  const bugs = getPagingData(data, page, limit);
  return res.status(200).json({
    success: true,
    message: 'Bugs retrieved successfully',
    bugs,
  });
};

export default { getBugs };