import Joi from 'joi';

const validateStatusUpdate = (user) => {
  const schema = {
    status: Joi.string()
      .valid(
        'ACCEPTED',
        'DECLINED',
        'PENDING',
        'VIEWED',
        'IN PROGRESS',
        'HIRED'
      )
      .required(),
    notes: Joi.string().trim().allow(null).allow(''),
  };
  return Joi.validate(user, schema);
};

export default validateStatusUpdate;
