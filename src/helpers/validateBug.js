import Joi from 'joi';

const validateBug = (payload) => {
  const schema = {
    email: Joi.string().min(5).trim().required().email(),
    body: Joi.string()
  };
  return Joi.validate(payload, schema);
};

export default validateBug;
