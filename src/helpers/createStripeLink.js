// import linkShortener from './linkShortener';

/* eslint-disable camelcase */
const stripe = require('stripe')(process.env.STRIPE_SECRET);

const stripeLink = async (name, amount, success_url, cancel_url, metadata) => {
  const createProduct = await stripe.products.create({
    name,
  });
  const createPrice = await stripe.prices.create({
    unit_amount: amount * 100,
    currency: 'usd',
    product: createProduct.id,
  });
    // const success_url = await linkShortener.getUrl(
    //   `https://clientptp.vercel.app/employer/jobs/${job.id}?token=${payload.token}&status=true&type=payment&payment=true`
    // );
    // const cancel_url = await linkShortener.getUrl(
    //   `https://clientptp.vercel.app/employer/jobs/${job.id}?token=${payload.token}&status=false&type=payment&payment=true`
    // );
    // console.log(success_url, cancel_url);
  const session = await stripe.checkout.sessions.create({
    success_url,
    cancel_url,
    line_items: [{ price: createPrice.id, quantity: 1 }],
    mode: 'payment',
    metadata,
    payment_intent_data: {
      metadata
    },
  });

  return session.url;
};

export default { stripeLink };
