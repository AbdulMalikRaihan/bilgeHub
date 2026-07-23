"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasOne(models.Student, {
        foreignKey: "UserId",
      });

      User.hasOne(models.Instructor, {
        foreignKey: "UserId",
      });
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
          msg: "Email already registered"
        },
        validate: {
          notNull: {
            msg: "Email is required",
          },
          notEmpty: {
            msg: "Email is required",
          },
          isEmail: {
            msg: "Invalid email format",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Password is required",
          },
          notEmpty: {
            msg: "Password is required",
          },
          len: {
            args: [6, 100],
            msg: "Password minimum 6 characters",
          },
        },
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Role is required",
          },
          notEmpty: {
            msg: "Role is required",
          },
          isIn: {
            args: [["Student", "Instructor"]],
            msg: "Invalid role",
          },
        },
      },
    },
    {
      hooks: {
        beforeCreate(user) {
          user.password = bcrypt.hashSync(user.password, 10);
        },
      },
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
