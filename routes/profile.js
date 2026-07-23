const router = require("express").Router();
const Controller = require("../controllers/controller");

router.get("/profile/edit", Controller.getEditProfile);
router.post("/profile/edit", Controller.postEditProfile);

module.exports = router;
