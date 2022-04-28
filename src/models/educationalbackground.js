'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EducationalBackground extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      EducationalBackground.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }
  EducationalBackground.init(
    {
      userId: DataTypes.INTEGER,
      school: DataTypes.STRING,
      course: DataTypes.STRING,
      degree: DataTypes.STRING,
      startDate: DataTypes.STRING,
      endDate: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'EducationalBackground',
    }
  );
  return EducationalBackground;
};