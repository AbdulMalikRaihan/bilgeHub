const router = require("express").Router();
const Controller = require("../controllers/controller");
const { authorizationStudent } = require("../middlewares/auth");

router.get("/my-learning", authorizationStudent, Controller.myLearning);
router.get(
  "/my-learning/:courseId",
  authorizationStudent,
  Controller.learningPage
);

router.post(
  "/my-learning/:courseId/material/:index",
  authorizationStudent,
  Controller.completeMaterial
);

router.get(
  "/certificate/:enrollmentId",
  authorizationStudent,
  Controller.downloadCertificate
);

module.exports = router;
