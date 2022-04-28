import Joi from 'joi';

const validateSignUp = (user) => {
  const schema = {
    email: Joi.string().min(5).trim().required().email(),
    // username: Joi.string().min(2).trim().required(),
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
    roleId: Joi.number()
      // .valid(1,2)
      .required(),
    companyName: Joi.string().trim().allow(null).allow(''),
    website: Joi.string().trim().uri().allow(null).allow(''),
    industry: Joi.string().trim().allow(null).allow(''),
  };
  return Joi.validate(user, schema);
};

export default validateSignUp;
