'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('JobReferrals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      jobApplicationId: {
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Date.now(),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('JobReferrals');
  }
};