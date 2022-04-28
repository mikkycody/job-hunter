'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JobCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      JobCategory.hasMany(models.Job, {
        foreignKey: 'categoryId',
        as: 'jobs',
      });

      JobCategory.hasMany(models.Subcategory, {
        foreignKey: 'categoryId',
        as: 'subCategories',
      });
    }
  };
  JobCategory.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'JobCategory',
    }
  );
  return JobCategory;
};