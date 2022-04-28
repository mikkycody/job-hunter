import models from '../models';

const Sequelize = require('sequelize');

const { Op } = Sequelize;

const getUserById = async (id) => {
  try {
    return await models.User.findByPk(id, {
      include: [
        {
          model: models.Role,
          as: 'Roles',
        },
        {
          model: models.Hashtag,
          as: 'Hashtags',
        },
        {
          model: models.Language,
          as: 'Languages',
        },
        {
          model: models.Resume,
          as: 'Resumes',
        },
        {
          model: models.SubAccount,
          as: 'SubAccount',
        },
        {
          model: models.EducationalBackground,
          as: 'Education',
        },
        {
          model: models.WorkExperience,
          as: 'WorkExperience',
        },
      ],
    });
  } catch (error) {
    throw Error(error);
  }
};

const checkUsername = async (username, id) => {
  try {
    return await models.User.findOne({
      where: { username, id: { [Op.ne]: id } },
    });
  } catch (error) {
    throw Error(error);
  }
};

const getUserByUsername = async (username) => {
  try {
    return await models.User.findOne({
      where: { username },
      include: [
        {
          model: models.Role,
          as: 'Roles',
        },
        {
          model: models.Hashtag,
          as: 'Hashtags',
        },
        {
          model: models.Language,
          as: 'Languages',
        },
        {
          model: models.Resume,
          as: 'Resumes',
        },
        {
          model: models.SubAccount,
          as: 'SubAccount',
        },
        {
          model: models.EducationalBackground,
          as: 'Education',
        },
        {
          model: models.WorkExperience,
          as: 'WorkExperience',
        },
      ],
    });
  } catch (error) {
    throw Error(error);
  }
};

const updateUser = async (id, payload) => {
  try {
    if (payload.hashtags) {
      const userId = id;
      await models.UserHashtag.destroy({ where: { userId } });
    }
    if (payload.languages) {
      const userId = id;
      await models.UserLanguage.destroy({ where: { userId } });
    }
    return await models.User.update(payload, {
      where: { id },
      returning: true,
    });
  } catch (error) {
    throw Error(error);
  }
};

const addUserHashtag = async (payload) => {
  try {
    return await models.UserHashtag.bulkCreate(payload);
  } catch (err) {
    throw Error(err);
  }
};

const addUserLanguage = async (payload) => {
  try {
    return await models.UserLanguage.bulkCreate(payload);
  } catch (err) {
    throw Error(err);
  }
};

const updateResume = async (userId, link) => {
  try {
    return await models.Resume.create({
      link,
      userId,
    });
  } catch (err) {
    throw Error(err);
  }
};

const deleteResume = async (userId, id) => {
  try {
    return await models.Resume.destroy({ where: { userId, id } });
  } catch (err) {
    throw Error(err);
  }
};

const addProfileView = async (userId, viewerId) => {
  try {
    return await models.ProfileView.create({ userId, viewerId });
  } catch (err) {
    throw Error(err);
  }
};

const getAdmins = async (limit, offset) => {
  try {
    return await models.User.findAndCountAll({
      limit,
      offset,
      distinct: true,
      include: [
        {
          model: models.Role,
          as: 'Roles',
          where: { id: 3 },
        },
        {
          model: models.Hashtag,
          as: 'Hashtags',
        },
        {
          model: models.Language,
          as: 'Languages',
        },
        {
          model: models.Resume,
          as: 'Resumes',
        },
        {
          model: models.SubAccount,
          as: 'SubAccount',
        },
        {
          model: models.EducationalBackground,
          as: 'Education',
        },
        {
          model: models.WorkExperience,
          as: 'WorkExperience',
        },
      ],
    });
  } catch (error) {
    throw Error(error);
  }
};

const getEmployers = async (limit, offset) => {
  try {
    return await models.User.findAndCountAll({
      limit,
      offset,
      distinct: true,
      include: [
        {
          model: models.Role,
          as: 'Roles',
          where: { id: 2 },
        },
        {
          model: models.Hashtag,
          as: 'Hashtags',
        },
        {
          model: models.Language,
          as: 'Languages',
        },
        {
          model: models.Resume,
          as: 'Resumes',
        },
        {
          model: models.SubAccount,
          as: 'SubAccount',
        },
        {
          model: models.EducationalBackground,
          as: 'Education',
        },
        {
          model: models.WorkExperience,
          as: 'WorkExperience',
        },
      ],
    });
  } catch (error) {
    throw Error(error);
  }
};

const getCandidates = async (limit, offset) => {
  try {
    return await models.User.findAndCountAll({
      limit,
      offset,
      distinct: true,
      include: [
        {
          model: models.Role,
          as: 'Roles',
          where: { id: 1 },
        },
        {
          model: models.Hashtag,
          as: 'Hashtags',
        },
        {
          model: models.Language,
          as: 'Languages',
        },
        {
          model: models.Resume,
          as: 'Resumes',
        },
        {
          model: models.SubAccount,
          as: 'SubAccount',
        },
        {
          model: models.EducationalBackground,
          as: 'Education',
        },
        {
          model: models.WorkExperience,
          as: 'WorkExperience',
        },
      ],
    });
  } catch (error) {
    throw Error(error);
  }
};

const getCandidatesNoPaginate = async () => {
  try {
    return await models.User.findAll({
      include: [
        {
          model: models.Role,
          as: 'Roles',
          where: { id: 1 },
        },
        {
          model: models.Hashtag,
          as: 'Hashtags',
        },
        {
          model: models.Language,
          as: 'Languages',
        },
        {
          model: models.Resume,
          as: 'Resumes',
        },
        {
          model: models.SubAccount,
          as: 'SubAccount',
        },
        {
          model: models.EducationalBackground,
          as: 'Education',
        },
        {
          model: models.WorkExperience,
          as: 'WorkExperience',
        },
      ],
    });
  } catch (error) {
    throw Error(error);
  }
};

const addWorkExperience = async (payload) => {
  try {
    return await models.WorkExperience.create(payload);
  } catch (error) {
    throw Error(error);
  }
};

const updateWorkExperience = async (id, userId, payload) => {
  try {
    return await models.WorkExperience.update(payload, {
      where: { id, userId },
      returning: true,
    });
  } catch (error) {
    throw Error(error);
  }
};

const deleteWorkExperience = async (id, userId) => {
  try {
    return await models.WorkExperience.destroy({
      where: { id, userId },
    });
  } catch (error) {
    throw Error(error);
  }
};

const getWorkExperiences = async (userId) => {
  try {
    return await models.WorkExperience.findAll({
      where: { userId },
    });
  } catch (error) {
    throw Error(error);
  }
};

const addEducation = async (payload) => {
  try {
    return await models.EducationalBackground.create(payload);
  } catch (error) {
    throw Error(error);
  }
};

const updateEducation = async (id, userId, payload) => {
  try {
    return await models.EducationalBackground.update(payload, {
      where: { id, userId },
      returning: true,
    });
  } catch (error) {
    throw Error(error);
  }
};

const deleteEducation = async (id, userId) => {
  try {
    return await models.EducationalBackground.destroy({
      where: { id, userId },
    });
  } catch (error) {
    throw Error(error);
  }
};

const getEducations = async (userId) => {
  try {
    return await models.EducationalBackground.findAll({
      where: { userId },
    });
  } catch (error) {
    throw Error(error);
  }
};

export default {
  getUserById,
  checkUsername,
  getUserByUsername,
  updateUser,
  addUserHashtag,
  addUserLanguage,
  updateResume,
  deleteResume,
  addProfileView,
  getAdmins,
  getCandidates,
  getEmployers,
  getCandidatesNoPaginate,
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  getWorkExperiences,
  addEducation,
  updateEducation,
  deleteEducation,
  getEducations,
};
