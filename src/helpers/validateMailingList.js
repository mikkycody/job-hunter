import Joi from 'joi';

const validateMailingList = (payload) => {
  const schema = {
    link: Joi.string().uri().trim(),
  };
  return Joi.validate(payload, schema);
};

export default validateMailingList;
