'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JobHashtag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  JobHashtag.init(
    {
      jobId: DataTypes.INTEGER,
      hashtagId: DataTypes.INTEGER,
      years: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'JobHashtag',
    }
  );
  return JobHashtag;
};
