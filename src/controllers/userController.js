import models from '../models';
import UserServices from '../services/userServices';
import AuthServices from '../services/authServices';
import hashtagServices from '../services/hashtagServices';
import languageServices from '../services/languageServices';
import validateUpdateProfile from '../helpers/validateUpdateProfile';
import validatePasswordUpdate from '../helpers/validatePasswordUpdate';
import validateWorkExperience from '../helpers/validateWorkExperience';
import validateUpdateWorkExperience from '../helpers/validateUpdateWorkExperience';
import validateEducation from '../helpers/validateEducation';
import validateUpdateEducation from '../helpers/validateUpdateEducation';
import stripeSubAccount from '../helpers/stripeSubAccount';
import NotificationService from '../services/notificationServices';
import { FRONTEND_URL } from '../config/constants';
import DeleteFromGcp from '../helpers/deleteFromGcp';

const getUser = async (req, res) => {
  try {
    const user = await UserServices.getUserByUsername(req.params.username);
    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }
    if (req.user.username !== user.dataValues.username) {
      await UserServices.addProfileView(user.dataValues.id, req.user.id);
      const notificationPayload = {
        userId: user.id,
        action: `${req.user.username} viewed your profile`,
        link: `${FRONTEND_URL}/profile/${req.user.username}`,
      };
      await NotificationService.addNotification(notificationPayload);
      const notifications = await NotificationService.getNotifications(user.id);
      io.emit('get_notifications', notifications);
    }
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { error } = validateUpdateProfile(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    if (req.body.username) {
      const checkUsername = await UserServices.checkUsername(
        req.body.username,
        req.user.id
      );

      if (checkUsername) {
        return res.status(400).json({
          error: 'Username already exists',
        });
      }
    }

    if (req.body.avatar) {
      const fetchUser = await UserServices.getUserByUsername(req.user.username);
      if (fetchUser.avatar) {
        await DeleteFromGcp.deleteFile(fetchUser.avatar);
      }
    }
    let user = await UserServices.updateUser(req.user.id, req.body);
    const { resume } = req.body;
    if (resume) {
      user = await UserServices.updateResume(req.user.id, resume);
    }
    let { hashtags } = req.body;
    if (hashtags) {
      const pivotArray = [];
      const years = hashtags.map((hashtag) => hashtag.years);
      const names = hashtags.map((hashtag) => hashtag.name);
      hashtags = await hashtagServices.findOrCreateHashtags(names);
      const tagIds = await hashtags.map((tag) => tag.dataValues.id);
      for (let i = 0; i < tagIds.length; i += 1) {
        pivotArray.push({
          userId: req.user.id,
          hashtagId: tagIds[i],
          years: years[i],
        });
      }
      await UserServices.addUserHashtag(pivotArray);
    }
    let { languages } = req.body;
    if (languages) {
      const languagePivotArray = [];
      const proficiency = languages.map((language) => language.proficiency);
      const names = languages.map((language) => language.language);
      languages = await languageServices.findOrCreateLanguages(names);
      const languageIds = await languages.map(
        (language) => language.dataValues.id
      );
      for (let i = 0; i < languageIds.length; i += 1) {
        languagePivotArray.push({
          userId: req.user.id,
          languageId: languageIds[i],
          proficiency: proficiency[i],
        });
      }
      await UserServices.addUserLanguage(languagePivotArray);
    }
    user = await UserServices.getUserById(req.user.id);
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

const updatePassword = async (req, res) => {
  const { error } = validatePasswordUpdate(req.body);
  if (error) {
    return res.status(400).json({
      error: error.details[0].message,
    });
  }
  try {
    const user = await AuthServices.getUserById(req.user.id);
    const token = req.headers.authorization.split(' ')[1];
    const passwordValid = await AuthServices.validatePassword(
      req.body.current_password,
      user.dataValues.password
    );
    if (!passwordValid) {
      return res.status(401).json({
        error: 'The password you entered is incorrect',
      });
    }
    const hashedPassword = await AuthServices.hashPassword(req.body.password);
    await UserServices.updateUser(req.user.id, { password: hashedPassword });

    const userData = {
      token,
      user,
    };
    return res.status(200).json({
      user: userData,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const findResume = await models.Resume.findOne({ where: { id, userId } });
    if (!findResume) {
      return res.status(404).json({
        error:
          'Something went wrong, Please confirm you have the permission to delete the resume and this resume exists.',
      });
    }
    const resume = await UserServices.deleteResume(userId, id);
    await DeleteFromGcp.deleteFile(findResume.link);
    return res.status(200).json({
      resume,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

const setupSubAccount = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const url = await stripeSubAccount.stripeAccount(req.user.id, token);
    return res.status(200).json({
      url,
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Account Already Created',
    });
  }
};

const resendAccountLink = async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const url = await stripeSubAccount.resendLink(req.user.id, token);
    return res.status(200).json({
      url,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

const updateSubAccount = async (req, res) => {
  try {
    await stripeSubAccount.update(req.user.id);
    // return res.status(200).json({
    //   subAccount,
    // });
    const token = req.headers.authorization.split(' ')[1];
    const user = await UserServices.getUserById(req.user.id);
    return res.status(200).json({
      token,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

const addWorkExperience = async (req, res) => {
  try {
    const { error } = validateWorkExperience(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }
    req.body.userId = req.user.id;
    const workExperience = await UserServices.addWorkExperience(req.body);
    return res.status(200).json({
      workExperience,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

const updateWorkExperience = async (req, res) => {
  try {
    const { error } = validateUpdateWorkExperience(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }
    const workExperience = await UserServices.updateWorkExperience(
      req.params.id,
      req.user.id,
      req.body
    );
    return res.status(200).json({
      workExperience: workExperience[1][0],
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

const deleteWorkExperience = async (req, res) => {
  try {
    const workExperience = await UserServices.deleteWorkExperience(
      req.params.id,
      req.user.id
    );
    return res.status(200).json({
      workExperience,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

const getWorkExperiences = async (req, res) => {
  try {
    const workExperience = await UserServices.getWorkExperiences(req.user.id);
    return res.status(200).json({
      workExperience,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

const addEducation = async (req, res) => {
  try {
    const { error } = validateEducation(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }
    req.body.userId = req.user.id;
    const education = await UserServices.addEducation(req.body);
    return res.status(200).json({
      education,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

const updateEducation = async (req, res) => {
  try {
    const { error } = validateUpdateEducation(req.body);
    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }
    const education = await UserServices.updateEducation(
      req.params.id,
      req.user.id,
      req.body
    );
    return res.status(200).json({
      education: education[1][0],
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

const deleteEducation = async (req, res) => {
  try {
    const education = await UserServices.deleteEducation(
      req.params.id,
      req.user.id
    );
    return res.status(200).json({
      education,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

const getEducation = async (req, res) => {
  try {
    const education = await UserServices.getEducations(req.user.id);
    return res.status(200).json({
      education,
    });
  } catch (err) {
    return res.status(500).json({
      error: err?.message,
    });
  }
};

export default {
  getUser,
  updateUser,
  updatePassword,
  deleteResume,
  setupSubAccount,
  resendAccountLink,
  updateSubAccount,
  addWorkExperience,
  updateWorkExperience,
  deleteWorkExperience,
  getWorkExperiences,
  addEducation,
  updateEducation,
  deleteEducation,
  getEducation,
};
