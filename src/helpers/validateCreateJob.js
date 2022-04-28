import Joi from 'joi';

const validateCreateJob = (job) => {
  const schema = {
    title: Joi.string().min(5).trim().required(),
    description: Joi.string().min(3).trim().required(),
    name: Joi.string().min(3).trim().required(),
    location: Joi.string().min(3).trim().required(),
    categoryId: Joi.number().integer().required(),
    subCategoryId: Joi.number().integer().required(),
    longitude: Joi.number().required(),
    latitude: Joi.number().required(),
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
      .required(),
    experience: Joi.string().min(3).trim().required(),
    campaign: Joi.number().integer(),
    salaryRangeMin: Joi.number().integer().required(),
    salaryRangeMax: Joi.number().integer().required(),
    qualification: Joi.string().min(3).trim().required(),
    vacancy: Joi.number().integer().required(),
    responsibilities: Joi.string().min(3).trim().required(),
    education: Joi.string().min(3).trim().required(),
    benefits: Joi.array().items(Joi.string().trim()).required(),
    expiryDate: Joi.date().required(),
    hashtags: Joi.array().items(Joi.object()).required(),
  };
  return Joi.validate(job, schema);
};

export default validateCreateJob;
