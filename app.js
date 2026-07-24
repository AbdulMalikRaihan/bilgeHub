const express = require("express");
const session = require("express-session");
const app = express();
const port = 3000;

const routes = require("./routes");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    secret: "bilgeHub",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
app.use((req, res, next) => {
  res.locals.user = req.session.user;

  next();
});

app.use(routes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
