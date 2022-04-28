/* eslint-disable consistent-return */
import UserService from '../../services/userServices';
import { getPagination, getPagingData } from '../../helpers/paginationHelper';
import validateUpdateProfile from '../../helpers/validateUpdateProfile';
import hashtagServices from '../../services/hashtagServices';
import authServices from '../../services/authServices';

const getAdmins = async (req, res) => {
  try {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const data = await UserService.getAdmins(limit, offset);
    const admins = getPagingData(data, page, limit);
    return res.status(200).json({
      admins,
    });
  } catch (err) {
    res.status(500).json({
      error: err?.message,
    });
  }
};

const getCandidates = async (req, res) => {
  try {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const data = await UserService.getCandidates(limit, offset);
    const candidates = getPagingData(data, page, limit);
    return res.status(200).json({
      candidates,
    });
  } catch (err) {
    res.status(500).json({
      error: err?.message,
    });
  }
};

const getEmployers = async (req, res) => {
  try {
    const { page, size } = req.query;
    const { limit, offset } = getPagination(page, size);
    const data = await UserService.getEmployers(limit, offset);
    const employers = getPagingData(data, page, limit);
    return res.status(200).json({
      employers,
    });
  } catch (err) {
    res.status(500).json({
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
    let user = await UserService.updateUser(req.params.id, req.body);
    if (req.body.username) {
      const checkUsername = await UserService.checkUsername(
        req.body.username,
        req.user.id
      );

      if (checkUsername) {
        return res.status(400).json({
          error: 'Username already exists',
        });
      }
    }
    const getUser = await UserService.getUserById(req.params.id);
    let { hashtags } = req.body;
    if (req.body.roleId) {
      await authServices.createUserRoles(getUser, req.body.roleId);
    }
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
      await UserService.addUserHashtag(pivotArray);
    }
    user = await UserService.getUserById(req.user.id);
    return res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({
      error: err?.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    return res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({
      error: err?.message,
    });
  }
};

export default { getAdmins, getCandidates, getEmployers, updateUser, getUser };
