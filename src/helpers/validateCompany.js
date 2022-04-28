import Joi from 'joi';

const validateCreateCompany = (payload) => {
  const schema = {
    name: Joi.string().trim().required(),
    imageUrl: Joi.string().trim(),
    link: Joi.string().uri().trim(),
  };
  return Joi.validate(payload, schema);
};

export default validateCreateCompany;
