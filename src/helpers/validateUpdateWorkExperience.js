import Joi from 'joi';

const validateUpdateWorkExperience = (payload) => {
  const schema = {
    company: Joi.string().trim().allow(null).allow(''),
    role: Joi.string().trim().allow(null).allow(''),
    jobDescription: Joi.string().trim().allow(null).allow(''),
    startDate: Joi.string().trim().allow(null).allow(''),
    endDate: Joi.string().trim().allow(null).allow(''),
  };
  return Joi.validate(payload, schema);
};

export default validateUpdateWorkExperience;
