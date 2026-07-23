const PDFDocument = require("pdfkit");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");
const { formattedPrice } = require("../helpers/helper");
const {
  User,
  Student,
  Course,
  Category,
  Instructor,
  Enrollment,
} = require("../models");

class Controller {
  static landingPage(req, res) {
    try {
      if (req.session.user) {
        return res.redirect("/home");
      }

      res.render("landingPage");
    } catch (error) {
      res.send(error);
    }
  }
  
  static async getRegister(req, res) {
    try {
      res.render("register", { errors: {} });
    } catch (error) {
      res.send(error);
    }
  }

  static async postRegister(req, res) {
    try {
      const { email, password, role } = req.body;

      const user = await User.create({
        email,
        password,
        role,
      });

      res.redirect(`/user-profile/${user.id}`);
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = {};

        error.errors.forEach((el) => {
          if (!errors[el.path]) {
            errors[el.path] = el.message;
          }
        });

        return res.render("register", {
          errors,
        });
      }
      res.send(error);
    }
  }

  static async getUserProfile(req, res) {
    const user = await User.findByPk(req.params.userId);

    res.render("addUserProfile", {
      user,
      errors: {},
    });
  }

  static async postUserProfile(req, res, next) {
    try {
      const user = await User.findByPk(req.params.userId);

      if (user.role === "Student") {
        await Student.create({
          fullName: req.body.fullName,

          phoneNumber: req.body.phoneNumber,

          dateOfBirth: req.body.dateOfBirth,

          UserId: user.id,
        });
      } else {
        await Instructor.create({
          fullName: req.body.fullName,

          expertise: req.body.expertise,

          bio: req.body.bio,

          yearsExperience: req.body.yearsExperience,

          imageUrl: req.body.imageUrl,

          UserId: user.id,
        });
      }

      res.redirect("/login");
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const user = await User.findByPk(req.params.userId);

        const errors = {};

        error.errors.forEach((el) => {
          if (!errors[el.path]) {
            errors[el.path] = el.message;
          }
        });

        return res.render("addUserProfile", {
          user,
          errors,
        });
      }
      res.send(error);
    }
  }

  static async getLogin(req, res) {
    try {
      res.render("login", {
        errors: {},
      });
    } catch (error) {
      res.send(error);
    }
  }

  static async postLogin(req, res, next) {
    try {
      const { email, password } = req.body;

      const errors = {};

      if (!email) {
        errors.email = "Email is required";
      }

      if (!password) {
        errors.password = "Password is required";
      }

      if (Object.keys(errors).length > 0) {
        return res.render("login", {
          errors,
        });
      }

      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        return res.render("login", {
          errors: {
            login: "Invalid email or password",
          },
        });
      }

      const validPassword = bcrypt.compareSync(password, user.password);

      if (!validPassword) {
        return res.render("login", {
          errors: {
            login: "Invalid email or password",
          },
        });
      }

      req.session.user = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      req.session.save((err) => {
        if (err) return next(err);

        if (user.role === "Student") {
          return res.redirect("/home");
        }

        return res.redirect("/my-courses");
      });
    } catch (error) {
      res.send(error);
    }
  }

  static async getEditProfile(req, res) {
    try {
      const user = await User.findByPk(req.session.user.id);

      let profile;

      if (user.role === "Student") {
        profile = await Student.findOne({
          where: {
            UserId: user.id,
          },
        });
      } else {
        profile = await Instructor.findOne({
          where: {
            UserId: user.id,
          },
        });
      }

      res.render("editProfile", {
        user,
        profile,
        errors: {},
      });
    } catch (error) {
      res.send(error);
    }
  }

  static async postEditProfile(req, res) {
    try {
      const user = await User.findByPk(req.session.user.id);

      if (user.role === "Student") {
        await Student.update(
          {
            fullName: req.body.fullName,
            phoneNumber: req.body.phoneNumber,
            dateOfBirth: req.body.dateOfBirth,
          },
          {
            where: {
              UserId: user.id,
            },
          }
        );
      } else {
        await Instructor.update(
          {
            fullName: req.body.fullName,
            expertise: req.body.expertise,
            bio: req.body.bio,
            yearsExperience: req.body.yearsExperience,
            imageUrl: req.body.imageUrl,
          },
          {
            where: {
              UserId: user.id,
            },
          }
        );
      }

      res.redirect("/home");
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const errors = {};

        error.errors.forEach((el) => {
          if (!errors[el.path]) {
            errors[el.path] = el.message;
          }
        });

        const user = await User.findByPk(req.session.user.id);

        let profile;

        if (user.role === "Student") {
          profile = await Student.findOne({
            where: { UserId: user.id },
          });
        } else {
          profile = await Instructor.findOne({
            where: { UserId: user.id },
          });
        }

        return res.render("editProfile", {
          user,
          profile,
          errors,
        });
      }

      res.send(error);
    }
  }

  static logout(req, res) {
    req.session.destroy(() => {
      res.redirect("/login");
    });
  }

  static async home(req, res) {
    try {
      const { search, category } = req.query;

      let option = {
        include: [Category, Instructor],
        where: {},
      };

      if (search) {
        option.where.name = {
          [Op.iLike]: `%${search}%`,
        };
      }

      if (category) {
        option.where.CategoryId = Number(category);
      }

      if (Object.keys(option.where).length === 0) {
        delete option.where;
      }

      const courses = await Course.findAll(option);
      const categories = await Category.findAll();

      res.render("home", {
        courses,
        categories,
        search,
        selectedCategory: Number(category),
        formattedPrice,
      });
    } catch (error) {
      res.send(error);
    }
  }

  static async instructorList(req, res, next) {
    try {
      const { search } = req.query;

      const option = {
        include: [Course],
      };

      if (search) {
        option.where = {
          fullName: {
            [Op.iLike]: `%${search}%`,
          },
        };
      }

      const instructors = await Instructor.findAll(option);

      res.render("instructors", {
        instructors,
        search,
      });
    } catch (error) {
      next(error);
    }
  }

  static async courseDetail(req, res) {
    try {
      const { id } = req.params;

      const course = await Course.findByPk(id, {
        include: [Category, Instructor],
      });

      if (!course) {
        throw new Error("Course not found");
      }

      const materials = course.material
        .split("\n")
        .filter(
          (item) => item.trim() !== "" && !item.includes("Course Materials")
        );

      let enrollment = null;
      let isEnrolled = false;

      if (req.session.user.role === "Student") {
        const student = await Student.findOne({
          where: {
            UserId: req.session.user.id,
          },
        });

        enrollment = await Enrollment.findOne({
          attributes: [
            "id",
            "enrolledDate",
            "progress",
            "StudentId",
            "CourseId",
            "completedMaterial",
          ],
          where: {
            StudentId: student.id,
            CourseId: course.id,
          },
        });

        if (enrollment) {
          isEnrolled = true;
        }
      }

      res.render("courseDetail", {
        course,
        materials,
        enrollment,
        isEnrolled,
        formattedPrice,
      });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async myLearning(req, res) {
    try {
      const student = await Student.findOne({
        where: {
          UserId: req.session.user.id,
        },
      });

      const enrollments = await Enrollment.getStudentCourses(student.id);

      const completed = enrollments.filter((el) => el.progress === 100).length;

      const inProgress = enrollments.filter((el) => el.progress < 100).length;

      res.render("myLearning", {
        enrollments,
        completed,
        inProgress,
      });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
  }

  static async learningPage(req, res, next) {
    try {
      const { courseId } = req.params;

      const student = await Student.findOne({
        where: {
          UserId: req.session.user.id,
        },
      });

      const enrollment = await Enrollment.findOne({
        attributes: [
          "id",
          "enrolledDate",
          "progress",
          "StudentId",
          "CourseId",
          "completedMaterial",
        ],
        where: {
          StudentId: student.id,
          CourseId: courseId,
        },

        include: [
          {
            model: Course,
            include: [Instructor],
          },
        ],
      });

      if (!enrollment) {
        throw new Error("Course not found");
      }

      const materials = enrollment.Course.material
        .split("\n")
        .filter((item) => item.includes("."));

      const checked = enrollment.completedMaterial
        ? enrollment.completedMaterial.split(",")
        : [];

      res.render("learningPage", {
        enrollment,
        materials,
        checked,
      });
    } catch (error) {
      res.send(error);
    }
  }

  static async completeMaterial(req, res) {
    try {
      const { courseId, index } = req.params;

      const student = await Student.findOne({
        where: {
          UserId: req.session.user.id,
        },
      });

      const enrollment = await Enrollment.findOne({
        where: {
          StudentId: student.id,

          CourseId: courseId,
        },

        include: [Course],
      });

      let completed = enrollment.completedMaterial
        ? enrollment.completedMaterial.split(",")
        : [];

      if (!completed.includes(index)) {
        completed.push(index);
      }

      const materials = enrollment.Course.material
        .split("\n")
        .filter((item) => item.includes("."));

      const progress = Math.round((completed.length / materials.length) * 100);

      await enrollment.update({
        completedMaterial: completed.join(","),

        progress,
      });

      res.redirect(`/my-learning/${courseId}`);
    } catch (error) {
      res.send(error);
    }
  }

  static async downloadCertificate(req, res) {
    try {
      const { enrollmentId } = req.params;

      const enrollment = await Enrollment.findOne({
        where: {
          id: enrollmentId,
        },
        include: [
          {
            model: Student,
          },
          {
            model: Course,
            include: [Instructor],
          },
        ],
      });

      console.log(enrollment);

      if (!enrollment) {
        throw new Error("Certificate not found");
      }

      if (enrollment.progress < 100) {
        throw new Error("Course has not been completed");
      }

      const doc = new PDFDocument();

      res.setHeader("Content-Type", "application/pdf");

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${enrollment.Course.name}-certificate.pdf"`
      );

      doc.pipe(res);

      doc.fontSize(28).text("BILGEHUB", {
        align: "center",
      });

      doc.moveDown();

      doc.fontSize(22).text("Certificate of Completion", {
        align: "center",
      });

      doc.moveDown(2);

      doc.fontSize(16).text("This certificate is proudly presented to", {
        align: "center",
      });

      doc.moveDown();

      doc.fontSize(24).text(enrollment.Student.fullName, {
        align: "center",
      });

      doc.moveDown(2);

      doc.fontSize(16).text(`For successfully completing the course`, {
        align: "center",
      });

      doc.moveDown();

      doc.fontSize(22).text(enrollment.Course.name, {
        align: "center",
      });

      doc.moveDown(2);

      doc
        .fontSize(14)
        .text(`Instructor : ${enrollment.Course.Instructor.fullName}`, {
          align: "center",
        });

      doc.text(`Completion Date : ${new Date().toLocaleDateString()}`, {
        align: "center",
      });

      doc.end();
    } catch (error) {
      res.send(error);
    }
  }

  static async enroll(req, res) {
    try {
      const { id } = req.params;
      const student = await Student.findOne({
        where: {
          UserId: req.session.user.id,
        },
      });

      const enrollment = await Enrollment.findOne({
        where: {
          StudentId: student.id,
          CourseId: id,
        },
      });

      if (enrollment) {
        throw new Error("You already enrolled this course");
      }

      await Enrollment.create({
        StudentId: student.id,
        CourseId: id,
        progress: 0,
      });

      res.redirect("/my-learning");
    } catch (error) {
      res.redirect(`/courses/${req.params.id}?error=${error.message}`);
    }
  }

  static async myCourses(req, res) {
    const instructor = await Instructor.findOne({
      where: {
        UserId: req.session.user.id,
      },
    });

    const courses = await Course.findAll({
      where: {
        InstructorId: instructor.id,
      },

      include: [Category],
    });

    res.render("myCourses", {
      courses,
      formattedPrice,
      request: req,
    });
  }

  static async getAddCourse(req, res) {
    try {
      const categories = await Category.findAll({
        order: [["name", "ASC"]],
      });

      res.render("addCourse", {
        categories,
        user: req.session.user,
        errors: {},
        course: {},
      });
    } catch (error) {
      res.send(error);
    }
  }
  static async postAddCourse(req, res) {
    try {
      const {
        name,
        description,
        material,
        CategoryId,
        level,
        duration,
        price,
        imageUrl,
      } = req.body;

      const instructor = await Instructor.findOne({
        where: {
          UserId: req.session.user.id,
        },
      });

      await Course.create({
        name,
        description,
        material,
        CategoryId,
        InstructorId: instructor.id,
        level,
        duration,
        price,
        imageUrl,
      });

      res.redirect("/my-courses");
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const categories = await Category.findAll({
          order: [["name", "ASC"]],
        });

        const instructor = await Instructor.findOne({
          where: {
            UserId: req.session.user.id,
          },
        });

        const errors = {};

        error.errors.forEach((el) => {
          if (!errors[el.path]) {
            errors[el.path] = el.message;
          }
        });

        return res.render("addCourse", {
          categories,
          user: req.session.user,
          errors,
          course: req.body,
        });
      }

      res.send(error);
    }
  }

  static async getEditCourse(req, res, next) {
    try {
      const { id } = req.params;

      const [course, categories] = await Promise.all([
        Course.findByPk(id),
        Category.findAll({
          order: [["name", "ASC"]],
        }),
      ]);

      if (!course) {
        throw new Error("Course not found");
      }

      res.render("editCourse", {
        course,
        categories,
        user: req.session.user,
        errors: {},
      });
    } catch (error) {
      next(error);
    }
  }

  static async postEditCourse(req, res) {
    try {
      const { id } = req.params;

      const {
        name,
        description,
        material,
        CategoryId,
        level,
        duration,
        price,
        imageUrl,
      } = req.body;

      await Course.update(
        {
          name,
          description,
          material,
          CategoryId,
          level,
          duration,
          price,
          imageUrl,
        },
        {
          where: {
            id,
          },
        }
      );

      res.redirect("/my-courses");
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        const course = await Course.findByPk(req.params.id);

        const categories = await Category.findAll({
          order: [["name", "ASC"]],
        });

        const errors = {};

        error.errors.forEach((el) => {
          if (!errors[el.path]) {
            errors[el.path] = el.message;
          }
        });

        Object.assign(course, req.body);

        return res.render("editCourse", {
          course,
          categories,
          user: req.session.user,
          errors,
        });
      }

      res.send(error);
    }
  }

  static deleteCourse(req, res) {
    const { id } = req.params;

    let courseName = "";

    Course.findByPk(id)
      .then((course) => {
        if (!course) {
          throw new Error("Course not found");
        }

        courseName = course.name;

        return Course.destroy({
          where: {
            id,
          },
        });
      })
      .then(() => {
        res.redirect(
          `/my-courses?success=${encodeURIComponent(
            `Course "${courseName}" deleted successfully`
          )}`
        );
      })
      .catch((err) => {
        res.redirect(`/my-courses?error=${encodeURIComponent(err.message)}`);
      });
  }
}

module.exports = Controller;
