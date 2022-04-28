'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
     await queryInterface.addColumn('Jobs', 'numberOfPromotionDays', {
       type: Sequelize.INTEGER,
     });

     await queryInterface.addColumn('Jobs', 'promotionAmountPerDay', {
       type: Sequelize.INTEGER,
     });

     await queryInterface.addColumn('Jobs', 'promotionEndDate', {
       type: Sequelize.DATE,
     });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Jobs', 'numberOfPromotionDays');
    await queryInterface.removeColumn('Jobs', 'promotionAmountPerDay');
    await queryInterface.removeColumn('Jobs', 'promotionEndDate');

  }
};
