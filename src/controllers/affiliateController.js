import accountServices from '../services/accountServices';
import affiliatesServices from '../services/affiliatesServices';
import { getPagination, getPagingData } from '../helpers/paginationHelper';

const getAffiliates = async (req, res) => {
  try {
    const { page, size } = req.query;

    const { limit, offset } = getPagination(page, size);
    const data = await affiliatesServices.getAffiliates(
      req.user.id,
      limit,
      offset
    );
    const affiliates = getPagingData(data, page, limit);
    return res.status(200).json({
      affiliates,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

const getAffiliatesPayment = async (req, res) => {
  try {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const data = await affiliatesServices.getAffiliatePayments(req.user.id,limit, offset);
    const payments = getPagingData(data, page, limit);
    return res.status(200).json({
      payments,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

const getBalance = async (req, res) => {
  try {
    const balance = await accountServices.balance(req.user.id);
    return res.status(200).json({
      balance,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

export default { getAffiliates, getAffiliatesPayment, getBalance };
