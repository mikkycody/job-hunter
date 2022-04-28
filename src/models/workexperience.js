'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WorkExperience extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      WorkExperience.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }
  WorkExperience.init(
    {
      userId: DataTypes.INTEGER,
      company: DataTypes.STRING,
      role: DataTypes.STRING,
      startDate: DataTypes.STRING,
      endDate: DataTypes.STRING,
      jobDescription: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'WorkExperience',
    }
  );
  return WorkExperience;
};
