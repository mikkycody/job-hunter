import models from '../models';

const getCompanies = async (limit, offset) =>
  models.Company.findAndCountAll({
    limit,
    offset,
    distinct: true,
  });

const allCompanies = async () => models.Company.findAll();

const getCompany = async (id) => models.Company.findByPk(id);

const create = async (payload) => models.Company.create(payload);

const update = async (id, payload) =>
  models.Company.update(payload, {
    where: { id },
    returning: true,
  });

const destroy = async (id) => models.Company.destroy({ where: { id } });

export default {
  getCompanies,
  getCompany,
  create,
  update,
  destroy,
  allCompanies,
};
