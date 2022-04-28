const axios = require('axios').default;

const coinbaseLink = async (findJob, payload) => {
  const res = await axios.post(
    'https://api.commerce.coinbase.com/charges/',
    {
      name: 'Power to the people',
      description: 'Job Promotion',
      local_price: {
        amount: payload.amount,
        currency: 'USD',
      },
      pricing_type: 'fixed_price',
      metadata: {
        jobId: findJob.id,
        number_of_days: payload.number_of_days,
        amount: payload.amount,
      },
      return_url: `https://ptpclient.vercel.app/employer/jobs/${findJob.id}?token=${payload.token}&status=true`,
      cancel_url: `https://ptpclient.vercel.app/employer/jobs/${findJob.id}?token=${payload.token}&status=false`,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-CC-Version': '2018-03-22',
        'X-CC-Api-Key': process.env.COINBASE_API_KEY,
      },
    }
  );
  return res.data.data.hosted_url;
};
export default { coinbaseLink };
