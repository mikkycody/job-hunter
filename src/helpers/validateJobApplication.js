import Joi from 'joi';

const validateJobApplication = (payload) => {
  const schema = {
    coverLetter: Joi.string().trim().allow(null).allow(''),
    resume: Joi.string().trim().required(),
    referrer: Joi.string().trim().allow(null).allow(''),
  };

  return Joi.validate(payload, schema);
};

export default validateJobApplication;