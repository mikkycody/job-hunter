'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserLanguage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserLanguage.init(
    {
      userId: DataTypes.INTEGER,
      languageId: DataTypes.INTEGER,
      proficiency: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'UserLanguage',
    }
  );
  return UserLanguage;
};
