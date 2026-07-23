"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Course.belongsTo(models.Instructor, {
        foreignKey: "InstructorId",
      });

      Course.belongsTo(models.Category, {
        foreignKey: "CategoryId",
      });

      Course.belongsToMany(models.Student, {
        through: models.Enrollment,
        foreignKey: "CourseId",
      });

      Course.hasMany(models.Enrollment, {
        foreignKey: "CourseId",
      });
    }

    get formattedDuration() {
      return `${this.duration} Hours`;
    }
  }
  Course.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Course name is required",
          },
          notEmpty: {
            msg: "Course name is required",
          },
          len: {
            args: [5, 100],
            msg: "Course name minimum 5 characters",
          },
        },
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Image URL is required",
          },
          notEmpty: {
            msg: "Image URL is required",
          },
          isUrl: {
            msg: "Image URL must be valid",
          },
        },
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Description is required",
          },
          notEmpty: {
            msg: "Description is required",
          },
          len: {
            args: [5, 1000],
            msg: "Description minimum 30 characters",
          },
        },
      },
      material: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Material is required",
          },
          notEmpty: {
            msg: "Material is required",
          },
          len: {
            args: [5, 1000],
            msg: "Material minimum 30 characters",
          },
        },
      },
      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Price is required",
          },
          notEmpty: {
            msg: "Price is required",
          },
          min: {
            args: [50000],
            msg: "Minimum price is Rp50.000",
          },
        },
      },
      InstructorId: {
        type: DataTypes.INTEGER,
      },
      CategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Category is required",
          },
        },
      },
      level: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Level is required",
          },
          notEmpty: {
            msg: "Level is required",
          },
          isIn: {
            args: [["Beginner", "Intermediate", "Advanced"]],
            msg: "Invalid level",
          },
        },
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Duration is required",
          },
          notEmpty: {
            msg: "Duration is required",
          },
          min: {
            args: [1],
            msg: "Duration minimum 1 hour",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Course",
    }
  );
  return Course;
};
