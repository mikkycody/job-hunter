import models from '../models';

const store = async (payload) => {
  try {
    const account = await models.Account.create(payload);
    return account;
  } catch (err) {
    throw Error(err);
  }
};

const balance = async (userId) => {
  try {
    const credit = await models.Account.sum('credit', { where: { userId } });
    const debit = await models.Account.sum('debit', { where: { userId } });
    return credit - debit;
  } catch (err) {
    throw Error(err);
  }
};

const createSubAccount = async (payload) => {
  try {
    const subaccount = await models.SubAccount.create(payload);
    return subaccount;
  } catch (err) {
    throw Error(err);
  }
};

const findSubAccount = async (userId) => {
  try {
    const findAccount = await models.SubAccount.findOne({
      where: {
        userId,
      },
    });
    return findAccount;
  } catch (err) {
    throw Error(err);
  }
};

const updateAccount = async (userId) => {
  try {
    const subaccount = await models.SubAccount.update(
      { status: true },
      {
        where: {
          userId,
        },
      }
    );

    return subaccount;
  } catch (err) {
    throw Error(err);
  }
};

const storeWithdrawal = async (payload) => {
  try {
    const withdrawal = await models.Withdrawal.create(payload);
    return withdrawal;
  } catch (err) {
    throw Error(err);
  }
};

const myWithdrawals = async (userId, limit, offset) => {
  try {
    const withdrawals = await models.Withdrawal.findAndCountAll({
      where: { userId },
      limit,
      offset,
      distinct: true,
      include: [
        {
          model: models.Account,
          as: 'Account',
        },
      ],
    });
    return withdrawals;
  } catch (err) {
    throw Error(err);
  }
};

const fetchWithdrawals = async (limit, offset) => {
  try {
    const withdrawals = await models.Withdrawal.findAndCountAll({
      limit,
      offset,
      distinct: true,
      include: [
        {
          model: models.Account,
          as: 'Account',
        },
      ],
    });
    return withdrawals;
  } catch (err) {
    throw Error(err);
  }
};

export default {
  store,
  balance,
  createSubAccount,
  findSubAccount,
  updateAccount,
  storeWithdrawal,
  myWithdrawals,
  fetchWithdrawals,
};
