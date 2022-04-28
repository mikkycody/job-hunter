'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Subcategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Subcategory.belongsTo(models.JobCategory, {
        foreignKey: 'categoryId',
        onDelete: 'CASCADE', // if category is deleted, delete all subcategories
        onUpdate: 'CASCADE',
      });
      
    }
  };
  Subcategory.init({
    categoryId: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Subcategory',
  });
  return Subcategory;
};