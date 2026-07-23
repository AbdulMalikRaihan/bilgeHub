'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Enrollment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Enrollment.belongsTo(models.Student, {
        foreignKey: "StudentId"
      });
    
      Enrollment.belongsTo(models.Course, {
        foreignKey: "CourseId"
      });
    }

    static getStudentCourses(studentId) {
      const { Course, Instructor } = sequelize.models;
  
      return Enrollment.findAll({
        attributes: [
          "id",
          "enrolledDate",
          "progress",
          "StudentId",
          "CourseId",
          "completedMaterial",
        ],
        where: {
          StudentId: studentId,
        },
        include: [
          {
            model: Course,
            include: [Instructor],
          },
        ],
      });
    }
  }
  Enrollment.init({
    enrolledDate: DataTypes.DATE,
    progress: DataTypes.INTEGER,
    StudentId: DataTypes.INTEGER,
    CourseId: DataTypes.INTEGER,
    completedMaterial: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Enrollment',
  });
  return Enrollment;
};