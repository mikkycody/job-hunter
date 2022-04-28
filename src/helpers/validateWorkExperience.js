import Joi from 'joi';

const validateWorkExperience = (payload) => {
  const schema = {
    company: Joi.string().trim().required(),
    role: Joi.string().trim().required(),
    jobDescription: Joi.string().trim().required(),
    startDate: Joi.string().trim().required(),
    endDate: Joi.string().trim().required(),
  };
  return Joi.validate(payload, schema);
};

export default validateWorkExperience;
