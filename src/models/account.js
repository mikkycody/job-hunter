'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Account.belongsTo(models.JobReferral, {
        foreignKey: 'jobReferralId',
      });

       Account.belongsTo(models.Withdrawal, {
         foreignKey: 'withdrawalId',
       });
    }
  }
  Account.init(
    {
      userId: DataTypes.INTEGER,
      reference: DataTypes.STRING,
      credit: DataTypes.INTEGER,
      debit: DataTypes.INTEGER,
      narration: DataTypes.STRING,
      jobReferralId: DataTypes.INTEGER,
      withdrawalId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Account',
    }
  );
  return Account;
};