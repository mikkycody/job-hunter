'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Job extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Job.belongsToMany(models.Hashtag, {
        foreignKey: 'jobId',
        onDelete: 'cascade',
        through: 'JobHashtag',
      });

      Job.belongsTo(models.JobCategory, {
        foreignKey: 'categoryId',
        as: 'Category',
      });

      Job.belongsTo(models.Subcategory, {
        foreignKey: 'subCategoryId',
        as: 'SubCategory',
      });

      Job.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'User',
      });

      Job.hasMany(models.JobApplication, {
        foreignKey: 'jobId',
        as: 'JobApplications',
      });

      Job.hasMany(models.Bookmark, {
        foreignKey: 'jobId',
        as: 'Bookmarks',
      });
    }
  }
  Job.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      categoryId: DataTypes.INTEGER,
      subCategoryId: DataTypes.INTEGER,
      location: DataTypes.STRING,
      longitude: DataTypes.DECIMAL,
      latitude: DataTypes.DECIMAL,
      jobType: DataTypes.STRING,
      experience: DataTypes.STRING,
      campaign: DataTypes.INTEGER,
      salaryRangeMin: DataTypes.INTEGER,
      salaryRangeMax: DataTypes.INTEGER,
      qualification: DataTypes.STRING,
      benefits: DataTypes.ARRAY(DataTypes.TEXT),
      vacancy: DataTypes.STRING,
      expiryDate: DataTypes.DATE,
      responsibilities: DataTypes.STRING,
      education: DataTypes.STRING,
      isPromoted: DataTypes.BOOLEAN,
      numberOfPromotionDays: DataTypes.INTEGER,
      promotionAmountPerDay: DataTypes.DECIMAL,
      promotionEndDate: DataTypes.DATE,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Job',
    }
  );
  return Job;
};
