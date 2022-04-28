'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JobReferral extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      JobReferral.belongsTo(models.JobApplication, {
        foreignKey: 'jobApplicationId',
        as: 'JobApplication',
      });

      JobReferral.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'User',
      });

      JobReferral.hasMany(models.Account, {
        foreignKey: 'jobReferralId',
        as: 'Accounts',
      });
    }
  }
  JobReferral.init(
    {
      jobApplicationId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'JobReferral',
    }
  );
  return JobReferral;
};
