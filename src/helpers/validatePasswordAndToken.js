import Joi from 'joi';

const validatePasswordAndToken = (payload) => {
  const schema = {
    password: Joi.string()
      .trim()
      .min(8)
      .regex(
        new RegExp(
          '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
        )
      )
      .required()
      .error(() => ({
        message: '"password" is not strong enough',
      })),
    token: Joi.string().min(5).trim().required(),
  };
  return Joi.validate(payload, schema);
};

export default validatePasswordAndToken;
