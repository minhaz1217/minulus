var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var passport = require("passport");
var session = require("express-session");


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');



var mongoose = require("mongoose");

//mongoose.connect("mongodb://localhost/minulus");
mongoose.connect("mongodb://mongoadmin:minhaz@localhost:27017/minulus?authSource=admin");

require("./models/accounts.js");
require("./models/data.js");
var api = require("./routes/api");
var authenticate = require("./routes/authenticate")(passport);


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: "this is my secret",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
var initPassport = require("./passport-init");
initPassport(passport);


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api', api);
app.use("/auth", authenticate);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
