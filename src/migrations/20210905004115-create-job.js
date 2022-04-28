'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Jobs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      title: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      userId: {
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      categoryId: {
        type: Sequelize.INTEGER,
      },
      subCategoryId: {
        type: Sequelize.INTEGER,
      },
      location: {
        type: Sequelize.STRING,
      },
      latitude: {
        type: Sequelize.DECIMAL,
      },
      longitude: {
        type: Sequelize.DECIMAL,
      },
      jobType: {
        type: Sequelize.STRING,
      },
      experience: {
        type: Sequelize.STRING,
      },
      salaryRangeMin: {
        type: Sequelize.INTEGER,
      },
      salaryRangeMax: {
        type: Sequelize.INTEGER,
      },
      qualification: {
        type: Sequelize.STRING,
      },
      vacancy: {
        type: Sequelize.STRING,
      },
      date: {
        type: Sequelize.DATE,
      },
      responsibilities: {
        type: Sequelize.TEXT,
      },
      benefits: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
      },
      education: {
        type: Sequelize.STRING,
      },
      isPromoted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Date.now(),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Date.now(),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Jobs');
  }
};
