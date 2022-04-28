import Joi from 'joi';

const validatePasswordUpdate = (user) => {
  const schema = {
    current_password: Joi.string().min(5).max(64).required(),
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
    password_confirmation: Joi.any()
      .valid(Joi.ref('password'))
      .required()
      .options({ language: { any: { allowOnly: 'must match password' } } }),
  };

  return Joi.validate(user, schema);
};

export default validatePasswordUpdate;
