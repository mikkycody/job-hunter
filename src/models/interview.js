'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Interview extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Interview.belongsTo(models.Job, {
        foreignKey: 'jobId',
        as: 'Job',
      });

      Interview.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'User',
      });
    }
  }
  Interview.init(
    {
      jobId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      url: DataTypes.STRING,
      cancelUrl: DataTypes.STRING,
      rescheduleUrl: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Interview',
    }
  );
  return Interview;
};
