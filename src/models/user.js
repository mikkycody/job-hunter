const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsToMany(models.Role, {
        foreignKey: 'userId',
        onDelete: 'cascade',
        through: 'UserRoles',
      });

      User.belongsToMany(models.Hashtag, {
        foreignKey: 'userId',
        onDelete: 'cascade',
        through: 'UserHashtag',
      });

      User.belongsToMany(models.Language, {
        foreignKey: 'userId',
        onDelete: 'cascade',
        through: 'UserLanguage',
      });

      User.hasMany(models.Resume, {
        foreignKey: 'userId',
        as: 'Resumes',
      });

      User.hasMany(models.EducationalBackground, {
        foreignKey: 'userId',
        as: 'Education',
      });

      User.hasMany(models.WorkExperience, {
        foreignKey: 'userId',
        as: 'WorkExperience',
      });

      User.hasMany(models.Job, {
        foreignKey: 'userId',
        as: 'Jobs',
      });

      User.hasOne(models.SubAccount, {
        foreignKey: 'userId',
        as: 'SubAccount',
      });

      User.hasMany(models.JobApplication, {
        foreignKey: 'userId',
        as: 'JobApplications',
      });
    }
  }
  User.init(
    {
      fullName: DataTypes.STRING,
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: {
        type: DataTypes.STRING,
        get() {
          return undefined;
        },
      },
      phone: DataTypes.STRING,
      emailVerifiedAt: DataTypes.DATE,
      address: DataTypes.STRING,
      companyName: DataTypes.STRING,
      website: DataTypes.STRING,
      industry: DataTypes.STRING,
      instagram: DataTypes.STRING,
      twitter: DataTypes.STRING,
      facebook: DataTypes.STRING,
      companySize: DataTypes.STRING,
      foundedDate: DataTypes.DATE,
      jobType: DataTypes.STRING,
      salaryMin: DataTypes.INTEGER,
      salaryMax: DataTypes.INTEGER,
      currentSalary: DataTypes.INTEGER,
      about: DataTypes.TEXT,
      avatar: DataTypes.STRING,
      timezone: DataTypes.STRING,
      professionalTitle: DataTypes.STRING,
      benefits: DataTypes.ARRAY(DataTypes.TEXT),
      // languages: {
      //   type: DataTypes.STRING,
      //   defaultValue: [],
      //   get: function () {
      //     return this.getDataValue('languages') ? JSON.parse(this.getDataValue('languages') ) : [];
      //   },
      //   set: function (val) {
      //     return this.setDataValue('languages', JSON.stringify(val));
      //   },
      // },
      availableToHire: DataTypes.BOOLEAN,
      gender: DataTypes.STRING,
      dob: DataTypes.DATE,
      isDisabled: DataTypes.BOOLEAN,
      country: DataTypes.STRING,
      city: DataTypes.STRING,
      confirmationCode: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
    }
  );
  return User;
};
