import Joi from 'joi';

const validateSignIn = (user) => {
  const schema = {
    email: Joi.string().min(5).trim().required().email(),
    password: Joi.string().min(6).trim().required(),
  };
  return Joi.validate(user, schema);
};

export default validateSignIn;
