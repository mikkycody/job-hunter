import models from '../models'

const create =  async (payload) => models.Bug.create(payload);

const getBugs = async (limit, offset) =>
  models.Bug.findAndCountAll({
    limit,
    offset,
    distinct: true,
  });

export default { create, getBugs };