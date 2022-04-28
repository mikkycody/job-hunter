import Joi from 'joi';

const validateJobPromotion = (payload) => {
  const schema = {
    amount: Joi.number().required(),
    number_of_days: Joi.number().required(),
    type: Joi.string()
      .valid('paypal', 'stripe', 'coinbase')
      .required(),
  };
  return Joi.validate(payload, schema);
};

export default validateJobPromotion;
