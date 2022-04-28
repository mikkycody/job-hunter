import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import models from '../models';

/**
 *
 * @param {*} userPayload
 * @returns {object}
 */
const registerUser = async (userPayload) => {
  try {
    const newUser = await models.User.create(userPayload);
    return newUser;
  } catch (error) {
    throw Error(error);
  }
};

const createUserRoles = async (user, role) => {
  // const roleMap = {
  //   employee: 1,
  //   employer: 2,
  //   admin: 3,
  // };
  // const assignRoles = roles.map(role => roleMap[role])
  try {
    const addUserToRoles = await user.setRoles(role);
    return addUserToRoles;
  } catch (error) {
    throw Error(error);
  }
};

const getUser = async (email) => {
  try {
    return await models.User.findOne({
      where: { email },
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

const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    throw Error(error);
  }
};

const validatePassword = async (requestPassword, userPassword) => {
  try {
    const validPassword = await bcrypt.compare(requestPassword, userPassword);
    return !!validPassword;
  } catch (error) {
    throw Error(error);
  }
};

const generateToken = (user, roles) => {
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      // fullName: user.fullName,
      // phone: user.phone,
      // address: user.address,
      // companyName: user.companyName,
      // website: user.website,
      // industry: user.industry,
      // instagram: user.instagram,
      // twitter: user.twitter,
      // facebook: user.facebook,
      // companySize: user.companySize,
      // foundedDate: user.foundedDate,
      // benefits: user.benefits,
      // expertise: user.expertise,
      // about: user.about,
      // avatar: user.avatar,
      // jobType: user.jobType,
      // salaryMin: user.salaryMin,
      // salaryMax: user.salaryMax,
      // availableToHire: user.availableToHire,
      // gender: user.gender,
      // dob: user.dob,
      // country: user.country,
      // city: user.city,
      // createdAt: user.createdAt,
      // updatedAt: user.updatedAt,
      roles,
    },
    process.env.JWT_SECRET,
    { expiresIn: '48h' }
  );
  return token;
};

const isExistingUser = async (email) => {
  try {
    const foundUser = await getUser(email);
    return !!foundUser;
  } catch (error) {
    throw Error(error);
  }
};

const verifyUser = async (confirmationCode) => {
  try {
    return await models.User.findOne({
      where: { confirmationCode },
    });
  } catch (error) {
    throw Error(error);
  }
};

export default {
  registerUser,
  isExistingUser,
  hashPassword,
  generateToken,
  getUser,
  validatePassword,
  createUserRoles,
  getUserById,
  verifyUser,
};
