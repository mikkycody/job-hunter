module.exports = {
  up: async (queryInterface) => {
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
      'Subcategories',
      [
        {
          categoryId: 1,
          name: 'VueJs Developer',
        },
        {
          categoryId: 1,
          name: 'NestJs Developer',
        },
        {
          categoryId: 2,
          name: 'Laravel Development',
        },
        {
          categoryId: 2,
          name: 'Golang Development',
        },
        {
          categoryId: 3,
          name: 'React Native Developer',
        },
        {
          categoryId: 3,
          name: 'Ionic Developer',
        },
        {
          categoryId: 4,
          name: 'Cloud Engineer',
        },
        {
          categoryId: 5,
          name: 'UX Researcher',
        },
      ],
      {}
    );
  },

  down: async (queryInterface) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Subcategories', null, {});
  }
};
