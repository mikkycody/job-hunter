const axios = require('axios').default;

const paypalLink = async (findJob, payload) => {

  const order = await axios.post(
    'https://api-m.sandbox.paypal.com/v2/checkout/orders',
    {
      intent: 'CAPTURE',
      application_context: {
        shipping_preference: 'NO_SHIPPING',
        user_action: 'PAY_NOW',
        return_url: `https://ptpclient.vercel.app/employer/jobs/${findJob.id}?token=${payload.token}&status=true`,
        cancel_url: `https://ptpclient.vercel.app/employer/jobs/${findJob.id}?token=${payload.token}&status=false`,
      },
      purchase_units: [
        {
          amount: {
            currency_code: 'USD',
            value: payload.amount,
          },
        },
      ],
    },
    {
      auth: {
        username: process.env.PAYPAL_CLIENT_ID,
        password: process.env.PAYPAL_SECRET,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return (order.data.links[1]).href;
};
export default { paypalLink };
