var createError = require('http-errors');
var express = require('express');
require('express-async-errors');

var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var apiRouter = require('./routes/v1/index');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'vue')));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/v1', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  const status = err.status || 500
  console.error(err)
  res.status(status);
  res.json({
    error: err.message,
    status
  });
});

module.exports = app;
