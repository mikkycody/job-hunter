import accountServices from '../../services/accountServices';
import { getPagination, getPagingData } from '../../helpers/paginationHelper';

const getWithdrawals = async (req, res ) => {
  try {
    const { page, size } = req.query;

    const { limit, offset } = getPagination(page, size);
    const data = await accountServices.fetchWithdrawals(
      limit,
      offset
    );
    const withdrawals = getPagingData(data, page, limit);
    return res.status(200).json({
      withdrawals,
    });
  } catch (err) {
    res.status(500).json({
      error: err?.message,
    });
  }
};

export default { getWithdrawals };
