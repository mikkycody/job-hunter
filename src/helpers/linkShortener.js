const axios = require('axios').default;

const headers = {
  'Content-Type': 'application/json',
  apikey: process.env.REBRANDLY_API,
};
const getUrl = async (url) => {
  const shorten = async () => {
    const endpoint = 'https://api.rebrandly.com/v1/links';
    const linkRequest = {
      destination: url,
      domain: { fullName: 'rebrand.ly' },
    };
    const apiCall = {
      method: 'post',
      url: endpoint,
      data: linkRequest,
      headers,
    };
    const apiResponse = await axios(apiCall);
    const link = apiResponse.data;
    return link.shortUrl;
  };

  const shortUrl = await shorten(url);
  return `https://${shortUrl}`;
};
export default { getUrl };
