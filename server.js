var express = require('express');
var path = require('path');
//var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var session = require('express-session');

passport.use(new Strategy({
    consumerKey: 'QIWdX0SsGQrN26GXlK0pe3JXA',
    consumerSecret: '4rb1Hz6uhd4Pl7OlBDkDP8irmJWRlEMIiCmg2U7AHYSlhbdvmq',
    callbackURL: 'http://localhost:4000/sessions/callback'
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

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//app.use(session({secret: 'whatever', resave: true, saveUninitialized: true}))
app.use(session({ secret: 'keyboard cat', key: 'sid'}))
app.use(passport.initialize())
app.use(passport.session())

// 

app.get('/', function(req, res) {
    res.json({user: req.user})
})

app.get('/twitter/login', passport.authenticate('twitter'))

app.get('/sessions/callback', passport.authenticate('twitter', {
    failureRedirect: '/'
}), function(req, res) {
    console.log({res});
    res.redirect('/')
})

app.listen(4000);