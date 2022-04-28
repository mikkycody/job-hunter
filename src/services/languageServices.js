import models from '../models';
// const { Op } = require("sequelize");

/**
 *
 * @param {*} userPayload
 * @returns {object}
 */
const createLanguage = async (languagePayload) => {
  try {
    return await models.Language.create(languagePayload);
  } catch (err) {
    throw Error(err);
  }
};

/**
 *
 * @param {*} userPayload
 * @returns {object}
 */
const findOrCreateLanguages = async (languagesPayload) => {
  try {
    return Promise.all(
      languagesPayload.map(async (language) => {
        const [result] = await models.Language.findOrCreate({
          where: {
            name: language,
          },
        });

        return result;
      })
    );
  } catch (err) {
    throw Error(err);
  }
};

const getLanguage = async (languageId) => {
  try {
    return await models.Language.findByPk(languageId);
  } catch (err) {
    throw Error(err);
  }
};

const getLanguages = async () => {
  try {
    return await models.Language.findAll();
  } catch (err) {
    throw Error(err);
  }
};
const updateLanguage = async (languageId, payload) => {
  try {
    return await models.Language.update(payload, { where: { id: languageId } });
  } catch (err) {
    throw Error(err);
  }
};

const deleteLanguage = async (languageId) => {
  try {
    return await models.Language.destroy({ where: { id: languageId } });
  } catch (err) {
    throw Error(err);
  }
};

export default {
  createLanguage,
  getLanguage,
  getLanguages,
  updateLanguage,
  deleteLanguage,
  findOrCreateLanguages,
};
