import Joi from 'joi';

const validateUpdateEducation = (payload) => {
  const schema = {
    school: Joi.string().trim().allow(null).allow(''),
    course: Joi.string().trim().allow(null).allow(''),
    degree: Joi.string().trim().allow(null).allow(''),
    startDate: Joi.string().trim().allow(null).allow(''),
    endDate: Joi.string().trim().allow(null).allow(''),
  };
  return Joi.validate(payload, schema);
};

export default validateUpdateEducation;
