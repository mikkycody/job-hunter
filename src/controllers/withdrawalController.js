import validateWithdrawal from '../helpers/validateWithdrawal';
import accountServices from '../services/accountServices';
import { getPagination, getPagingData } from '../helpers/paginationHelper';

const stripe = require('stripe')(process.env.STRIPE_SECRET);

const makeWithdrawal = async (req, res) => {
  try {
    const { error } = validateWithdrawal(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }
    const { amount } = req.body;
    const userBalance = accountServices.balance(req.user.id);
    if (amount > userBalance) {
      return res.status(400).json({
        error: 'Insufficient funds',
      });
    }
    const findSubAccount = await accountServices.findSubAccount(req.user.id);
    if (!findSubAccount) {
      return res.status(400).json({
        error: 'Please setup your account to withdraw funds',
      });
    }
    const transfer = await stripe.transfers.create({
      amount: amount * 100,
      currency: 'usd',
      destination: findSubAccount.dataValues.accountId,
    });
    const storeWithdrawal = await accountServices.storeWithdrawal({
      userId: req.user.id,
      method: 'stripe',
      amount,
    });
    const withdraw = await accountServices.store({
      userId: req.user.id,
      debit: amount,
      narration: `Withdrawal`,
      reference: transfer.id,
      withdrawalId: storeWithdrawal.dataValues.id,
    });

    return res.status(200).json({
      withdraw,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

const allWithdrawals = async (req, res) => {
  try {
    const { page, size } = req.query;

    const { limit, offset } = getPagination(page, size);
    const data = await accountServices.myWithdrawals(
      req.user.id,
      limit,
      offset
    );
    const withdrawals = getPagingData(data, page, limit);
    return res.status(200).json({
      withdrawals,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

export default { makeWithdrawal, allWithdrawals };
