import Joi from 'joi';

const validateUpdateProfile = (user) => {
  const schema = {
    fullName: Joi.string().min(2).trim().allow(null).allow(''),
    username: Joi.string().min(2).trim().allow(null).allow(''),
    phone: Joi.string().trim().allow(null).allow(''),
    address: Joi.string().min(3).trim().allow(null).allow(''),
    roleId: Joi.number(),
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
    benefits: Joi.array().items(Joi.string().trim()).allow(null).allow(''),
    languages: Joi.array().items(Joi.object()).allow(null).allow(''),
    companyName: Joi.string().trim().allow(null).allow(''),
    professionalTitle: Joi.string().trim().allow(null).allow(''),
    timezone: Joi.string().trim().allow(null).allow(''),
    website: Joi.string().trim().uri().allow(null).allow(''),
    industry: Joi.string().trim().allow(null).allow(''),
    instagram: Joi.string().trim().uri().allow(null).allow(''),
    twitter: Joi.string().trim().uri().allow(null).allow(''),
    facebook: Joi.string().trim().uri().allow(null).allow(''),
    companySize: Joi.string().allow(null).allow(''),
    foundedDate: Joi.date().allow(null).allow(''),
    salaryMin: Joi.number().integer().allow(null).allow(''),
    salaryMax: Joi.number().integer().allow(null).allow(''),
    currentSalary: Joi.number().integer().allow(null).allow(''),
    about: Joi.string().trim().allow(null).allow(''),
    availableToHire: Joi.boolean().allow(null).allow(''),
    isDisabled: Joi.boolean().allow(null).allow(''),
    gender: Joi.string().trim().allow(null).allow(''),
    resume: Joi.string().trim().allow(null).allow(''),
    avatar: Joi.string().trim().allow(null).allow(''),
    dob: Joi.date().allow(null).allow(''),
    country: Joi.string().trim().allow(null).allow(''),
    city: Joi.string().trim().allow(null).allow(''),
    hashtags: Joi.array().items(Joi.object()).allow(null).allow(''),
  };
  return Joi.validate(user, schema);
};

export default validateUpdateProfile;
