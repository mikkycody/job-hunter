import Joi from 'joi';

const validateWithdrawal = (payload) => {
  const schema = {
    amount: Joi.number().positive().greater(50).required(),
  };
  return Joi.validate(payload, schema);
};

export default validateWithdrawal;
