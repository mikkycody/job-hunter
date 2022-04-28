import companyServices from '../services/companyServices';

const getCompanies = async (req, res) => {
  const companies = await companyServices.allCompanies();
  return res.status(200).json({
    success: true,
    message: 'Companies retrieved successfully',
    companies,
  });
};

export default { getCompanies };
