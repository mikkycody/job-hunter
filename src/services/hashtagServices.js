import models from '../models';
// const { Op } = require("sequelize");

/**
 *
 * @param {*} userPayload
 * @returns {object}
 */
const createHashtag = async (hashtagPayload) => {
  try {
    return await models.Hashtag.create(hashtagPayload);
  } catch (err) {
    throw Error(err);
  }
};

/**
 *
 * @param {*} userPayload
 * @returns {object}
 */
const findOrCreateHashtags = async (hashtagsPayload) => {
  try {
    return Promise.all(hashtagsPayload.map(async (hashtag) => {
        const [result] = await models.Hashtag.findOrCreate({
            where: {
                name: hashtag,
            },
          });

          return result;
    }))
  } catch (err) {
    throw Error(err);
  }
};

const getHashtag = async (hashtagId) => {
  try {
    return await models.Hashtag.findByPk(hashtagId);
  } catch (err) {
    throw Error(err);
  }
};

const getHashtags = async () => {
  try {
    return await models.Hashtag.findAll();
  } catch (err) {
    throw Error(err);
  }
};
const updateHashtag = async (hashtagId, payload) => {
  try {
    return await models.Hashtag.update(payload, { where: { id: hashtagId } });
  } catch (err) {
    throw Error(err);
  }
};

const deleteHashtag = async (hashtagId) => {
  try {
    return await models.Hashtag.destroy({ where: { id: hashtagId } });
  } catch (err) {
    throw Error(err);
  }
};

export default {
  createHashtag,
  getHashtag,
  getHashtags,
  updateHashtag,
  deleteHashtag,
  findOrCreateHashtags,
};
