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
      'Users',
      [
        {
          fullName: 'John Doe',
          email: 'user@example.com',
          password:
            '$2a$10$MbfxCDT8SyaJ/hx2wb1bju7oPOr/aECqZIEIFPbvICV3El.N1TI7C',
        },
      ],
      {}
    );
    await queryInterface.bulkInsert(
      'Roles',
      [
        {
          name: 'employee',
        },
        {
          name: 'employer',
        },
        {
          name: 'admin',
        },
      ],
      {}
    );

    await queryInterface.bulkInsert(
      'UserRoles',
      [
        {
          userId: 1,
          roleId: 1,
        },
        {
          userId: 1,
          roleId: 2,
        },
      ],
      {}
    );

    await queryInterface.bulkInsert(
      'JobCategories',
      [
        {
          name: 'Frontend Development',
        },
        {
          name: 'Backend Development',
        },
        {
          name: 'Mobile Development',
        },
        {
          name: 'Dev Ops',
        },
        {
          name: 'UI/UX',
        },
      ],
      {}
    );

    await queryInterface.bulkInsert(
      'Subcategories',
      [
        {
          categoryId: 1,
          name: 'React Developer',
        },
        {
          categoryId: 2,
          name: 'NodeJs Development',
        },
        {
          categoryId: 3,
          name: 'Flutter Developer',
        },
        {
          categoryId: 4,
          name: 'AWS DevOps Engineer',
        },
        {
          categoryId: 5,
          name: 'Designer',
        },
      ],
      {}
    );

    await queryInterface.bulkInsert(
      'Hashtags',
      [
        {
          name: 'HTML',
        },
        {
          name: 'CSS',
        },
        {
          name: 'JAVASCRIPT',
        },
        {
          name: 'BOOTSTRAP',
        },
        {
          name: 'AJAX',
        },
        {
          name: 'PHP',
        },
        {
          name: 'NODEJS',
        },
        {
          name: 'LARAVEL',
        },
        {
          name: 'GIT',
        },
        {
          name: 'CODEIGNITER',
        },
        {
          name: 'AWS',
        },
        {
          name: 'REACTJS',
        },
        {
          name: 'NESTJS',
        },
        {
          name: 'ANGULAR',
        },
        {
          name: 'RUBY ON RAILS',
        },
        {
          name: 'GO',
        },
        {
          name: 'JAVA',
        },
        {
          name: 'FLUTTER',
        },
        {
          name: 'C#',
        },
        {
          name: 'C++',
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

    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Roles', null, {});
    await queryInterface.bulkDelete('UserRoles', null, {});
    await queryInterface.bulkDelete('JobCategories', null, {});
  },
};
