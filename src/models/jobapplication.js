'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JobApplication extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      JobApplication.belongsTo(models.Job, {
        foreignKey: 'jobId',
        as: 'Job',
      });

      JobApplication.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'User',
      });

      JobApplication.hasMany(models.JobReferral, {
        foreignKey: 'jobApplicationId',
        as: 'JobReferral',
      });
    }
  }
  JobApplication.init(
    {
      jobId: DataTypes.INTEGER,
      userId: DataTypes.INTEGER,
      coverLetter: DataTypes.TEXT,
      notes: DataTypes.TEXT,
      resume: DataTypes.STRING,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'JobApplication',
    }
  );
  return JobApplication;
};
