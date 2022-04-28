'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      'Languages',
      [
        { name: 'Mandarin Chinese' },
        { name: 'Spanish' },
        { name: 'English' },
        { name: 'Hindi/Urdu' },
        { name: 'Arabic' },
        { name: 'Bengali' },
        { name: 'Portuguese' },
        { name: 'Russian' },
        { name: 'Japanese' },
        { name: 'German' },
        { name: 'Javanese' },
        { name: 'Punjabi' },
        { name: 'Wu' },
        { name: 'French' },
        { name: 'Telugu' },
        { name: 'Vietnamese' },
        { name: 'Marathi' },
        { name: 'Korean' },
        { name: 'Tamil' },
        { name: 'Italian' },
        { name: 'Turkish' },
        { name: 'Cantonese/Yue' },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
