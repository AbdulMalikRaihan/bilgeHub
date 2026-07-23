function authentication(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }

  next();
}

function authorizationStudent(req, res, next) {
  if (req.session.user.role !== "Student") {
    return res.send("Only Student can access this page");
  }

  next();
}

function authorizationInstructor(req, res, next) {
  if (req.session.user.role !== "Instructor") {
    return res.send("Only Instructor can access this page");
  }

  next();
}

module.exports = {
  authentication,
  authorizationStudent,
  authorizationInstructor,
};
