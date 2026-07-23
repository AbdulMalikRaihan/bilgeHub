const router = require("express").Router();
const { authentication } = require("../middlewares/auth");

const userRouter = require("./user");
const profileRouter = require("./profile");
const courseRouter = require("./course");
const learningRouter = require("./learning");

router.use("/", userRouter);

router.use(authentication);
router.use("/", profileRouter);
router.use("/", courseRouter);
router.use("/", learningRouter);

module.exports = router;
