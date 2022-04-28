import Joi from 'joi';

const validateEducation = (payload) => {
  const schema = {
    school: Joi.string().trim().required(),
    course: Joi.string().trim().required(),
    degree: Joi.string().trim().required(),
    startDate: Joi.string().trim().required(),
    endDate: Joi.string().trim().required(),
  };
  return Joi.validate(payload, schema);
};

export default validateEducation;
