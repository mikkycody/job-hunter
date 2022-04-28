import companyServices from '../../services/companyServices';
import { getPagination, getPagingData } from '../../helpers/paginationHelper';
import validateCompany from '../../helpers/validateCompany';
import DeleteFromGcp from '../../helpers/deleteFromGcp';

const getCompanies = async (req, res) => {
  const { page, size } = req.query;
  const { limit, offset } = getPagination(page, size);
  const data = await companyServices.getCompanies(limit, offset);
  const companies = getPagingData(data, page, limit);
  return res.status(200).json({
    success: true,
    message: 'Companies retrieved successfully',
    companies,
  });
};

const createCompany = async (req, res) => {
  const { error } = validateCompany(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  const company = await companyServices.create(req.body);
  return res.status(200).json({
    success: true,
    message: 'Company added successfully',
    company,
  });
};

const updateCompany = async (req, res) => {
  const { error } = validateCompany(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: error.details[0].message,
    });
  }
  const getCompany = await companyServices.getCompany(req.params.id);
  if (!getCompany) {
    return res.status(400).json({
      success: false,
      message: 'Company with that id does not exist',
    });
  }
  const company = await companyServices.update(req.params.id, req.body);
  return res.status(200).json({
    success: true,
    message: 'Company updated successfully',
    company,
  });
};

const destroy = async (req, res) => {
  const getCompany = await companyServices.getCompany(req.params.id);
  if (!getCompany) {
    return res.status(400).json({
      success: false,
      message: 'Company with that id does not exist',
    });
  }
  if (getCompany.link) {
    await DeleteFromGcp.deleteFile(getCompany.link);
  }
  await companyServices.destroy(req.params.id);
  return res.status(200).json({
    success: true,
    message: 'Company deleted successfully',
  });
};

export default { getCompanies, createCompany, updateCompany, destroy };
