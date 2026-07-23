'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Student.belongsTo(models.User, {
        foreignKey: "UserId"
      });
    
      Student.belongsToMany(models.Course, {
        through: models.Enrollment,
        foreignKey: "StudentId"
      });
    
      Student.hasMany(models.Enrollment, {
        foreignKey: "StudentId"
      });
    }
  }
  Student.init({
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
    phoneNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Phone Number is required",
        },
        notEmpty: {
          msg: "Phone Number is required",
        },
        len: {
          args: [10, 15],
          msg: "Phone number must be between 10 and 15 digits",
        },
      },
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {
          msg: "Birth Date is required",
        },
        notEmpty: {
          msg: "Birth Date is required",
        }
      },
    },
    UserId: {
      type: DataTypes.INTEGER,
    },
  }, {
    sequelize,
    modelName: 'Student',
  });
  return Student;
};