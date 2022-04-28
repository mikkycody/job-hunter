import Joi from 'joi';

const validateUpdateJob = (job) => {
  const schema = {
    title: Joi.string().min(5).trim().allow(null).allow(''),
    description: Joi.string().min(3).trim().allow(null).allow(''),
    name: Joi.string().min(3).trim().allow(null).allow(''),
    location: Joi.string().min(3).trim().allow(null).allow(''),
    categoryId: Joi.number().integer().allow(null).allow(''),
    subCategoryId: Joi.number().integer().allow(null).allow(''),
    longitude: Joi.number().allow(null).allow(''),
    latitude: Joi.number().allow(null).allow(''),
    jobType: Joi.string()
      .valid(
        'Full-Time',
        'Part-Time',
        'Freelance',
        'Temporary',
        'Relocation',
        'Specialization',
        'Executive'
      )
      .allow(null)
      .allow(''),
    experience: Joi.string().min(3).trim().allow(null).allow(''),
    campaign: Joi.number().integer().allow(null).allow(''),
    salaryRangeMin: Joi.number().integer().allow(null).allow(''),
    salaryRangeMax: Joi.number().integer().allow(null).allow(''),
    qualification: Joi.string().min(3).trim().allow(null).allow(''),
    vacancy: Joi.number().integer().allow(null).allow(''),
    responsibilities: Joi.string().min(3).trim().allow(null).allow(''),
    education: Joi.string().min(3).trim().allow(null).allow(''),
    benefits: Joi.array().items(Joi.string().trim()),
    expiryDate: Joi.date().allow(null).allow(''),
    hashtags: Joi.when('status', {
      is: Joi.string().valid('ACTIVE', 'INACTIVE'),
      then: Joi.allow(null),
      otherwise: Joi.array().items(Joi.object()).required(),
    }),
    status: Joi.string().valid('ACTIVE', 'INACTIVE').allow(null).allow(''),
  };
  return Joi.validate(job, schema);
};

export default validateUpdateJob;
