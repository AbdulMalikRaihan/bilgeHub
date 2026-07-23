const router = require("express").Router();
const Controller = require("../controllers/controller");
const {
  authorizationStudent,
  authorizationInstructor,
} = require("../middlewares/auth");

router.get("/home", Controller.home);
router.get("/instructors", Controller.instructorList);

router.get("/my-courses", authorizationInstructor, Controller.myCourses);

router.get("/courses/add", authorizationInstructor, Controller.getAddCourse);
router.post("/courses/add", authorizationInstructor, Controller.postAddCourse);

router.get(
  "/courses/:id/edit",
  authorizationInstructor,
  Controller.getEditCourse
);
router.post(
  "/courses/:id/edit",
  authorizationInstructor,
  Controller.postEditCourse
);

router.get(
  "/courses/:id/delete",
  authorizationInstructor,
  Controller.deleteCourse
);

router.post("/courses/:id/enroll", authorizationStudent, Controller.enroll);

router.get("/courses/:id", Controller.courseDetail);

module.exports = router;
