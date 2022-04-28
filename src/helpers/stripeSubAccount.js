import accountServices from '../services/accountServices';

const stripe = require('stripe')(process.env.STRIPE_SECRET);

const stripeAccount = async (userId, token) => {
  let accountLink;
  const findSubAccount = await accountServices.findSubAccount(userId);
  if (!findSubAccount) {
    const account = await stripe.accounts.create({ type: 'express' });
    await accountServices.createSubAccount({
      userId,
      accountId: account.id,
    });
    accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `https://clientptp.vercel.app/employee/account?completed=false&token=${token}&type=account&account=true`,
      return_url: `https://clientptp.vercel.app/employee/account?completed=true&token=${token}&type=account&account=true`,
      type: 'account_onboarding',
    });
    return accountLink.url;
  }
  throw Error('Account Already Created');
};

const resendLink = async (userId, token) => {
  const findSubAccount = await accountServices.findSubAccount(userId);
  const accountLink = await stripe.accountLinks.create({
    account: findSubAccount.dataValues.accountId,
    refresh_url: `https://clientptp.vercel.app/employee/account?completed=false&token=${token}&type=account&account=true`,
    return_url: `https://clientptp.vercel.app/employee/account?completed=true&token=${token}&type=account&account=true`,
    type: 'account_onboarding',
  });

  return accountLink.url;
};

const update = async (userId) => {
  const findSubAccount = await accountServices.findSubAccount(userId);
  const lookUpAccount = await stripe.accounts.retrieve(
    findSubAccount.dataValues.accountId
  );
  if (lookUpAccount.details_submitted === true) {
    await accountServices.updateAccount(userId);
  }
  return lookUpAccount.details_submitted;
};

export default { stripeAccount, resendLink, update };
