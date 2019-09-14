var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('./config/mongoose');
var authRouter = require('./routes/auth');
var commonRouter = require('./routes/common.routes');
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var session = require('express-session');
const { consumerKey, consumerSecret, callbackURL } = require('./config/vars')
passport.use(new Strategy({
    consumerKey: consumerKey,
    consumerSecret: consumerSecret ,
    callbackURL: callbackURL
}, function(token, tokenSecret, profile, callback) {
    return callback(null, profile);
}));

passport.serializeUser(function(user, callback) {
    callback(null, user);
})

passport.deserializeUser(function(obj, callback) {
    callback(null, obj);
})


var app = express();



// open mongoose connection
mongoose.connect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'keyboard cat', key: 'sid'}))
app.use(passport.initialize())
app.use(passport.session())
app.use(function (req, res, next) {
  req.setTimeout(0);
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Credentials", true );
  next();
});
app.use('/twitter', commonRouter);
app.use('/auth', authRouter);

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
