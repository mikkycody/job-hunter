import Joi from 'joi';

const validateEmail = (payload) => {
  const schema = {
    email: Joi.string().min(5).trim().required().email(),
  };
  return Joi.validate(payload, schema);
};

export default validateEmail;
