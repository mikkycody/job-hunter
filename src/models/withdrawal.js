'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Withdrawal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Withdrawal.hasOne(models.Account, {
        foreignKey: 'withdrawalId',
        as: 'Account',
      });
    }
  }
  Withdrawal.init(
    {
      userId: DataTypes.INTEGER,
      amount: DataTypes.INTEGER,
      method: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Withdrawal',
    }
  );
  return Withdrawal;
};
