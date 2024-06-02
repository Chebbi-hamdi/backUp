var createError = require("http-errors");
var express = require("express");
require("dotenv").config();
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const mongoose = require("mongoose");
// const passport = require("./middlewares/passport");
const session = require("express-session");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users/usersRouter");

var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

const DB_URL = process.env.DB_URL || 'mongodb+srv://shampo:2FzVNx7KGrXNYMpk@cluster0.hbkxlkm.mongodb.net/bendaamar?retryWrites=true&w=majority';
// Configure express-session middleware
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

app.use("/", indexRouter);
app.use("/users", usersRouter);

mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB hellloooo Connected"))
  .catch((err) => console.log(err));

app.use(function (req, res, next) {
  next(createError(404));
});
//connection to seerver
app.listen(5000, () => {
  console.log("Server running on port 3000");
});  

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
