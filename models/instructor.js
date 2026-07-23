'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Instructor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Instructor.belongsTo(models.User, {
        foreignKey: "UserId",
      });
    
      Instructor.hasMany(models.Course, {
        foreignKey: "InstructorId",
      });
    }
  }
  Instructor.init({
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Full name is required",
        },
        notEmpty: {
          msg: "Full name is required",
        },
        len: {
          args: [3, 100],
          msg: "Full name must be at least 3 characters",
        },
      },
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Profile image is required",
        },
        notEmpty: {
          msg: "Profile image is required",
        },
        isUrl: {
          msg: "Image URL must be valid",
        },
      },
    },
    expertise: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Expertise is required",
        },
        notEmpty: {
          msg: "Expertise is required",
        },
        len: {
          args: [3, 50],
          msg: "Expertise must be at least 3 characters",
        },
      },
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Bio is required",
        },
        notEmpty: {
          msg: "Bio is required",
        },
        len: {
          args: [10, 500],
          msg: "Bio must be at least 10 characters",
        },
      },
    },
    yearsExperience: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Years of experience is required",
        },
        notEmpty: {
          msg: "Years of experience is required",
        },
        min: {
          args: [1],
          msg: "Minimun 1 Years of experience",
        },
      },
    },
    UserId: {
      type: DataTypes.INTEGER,
    },
  }, {
    sequelize,
    modelName: 'Instructor',
  });
  return Instructor;
};