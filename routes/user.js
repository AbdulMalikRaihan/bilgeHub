const router = require("express").Router();
const Controller = require("../controllers/controller");

router.get("/", Controller.landingPage);

router.get("/register", Controller.getRegister);
router.post("/register", Controller.postRegister);

router.get("/user-profile/:userId", Controller.getUserProfile);
router.post("/user-profile/:userId", Controller.postUserProfile);

router.get("/login", Controller.getLogin);
router.post("/login", Controller.postLogin);

router.get("/logout", Controller.logout);

module.exports = router;
