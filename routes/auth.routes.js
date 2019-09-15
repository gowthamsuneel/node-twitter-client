const express = require('express');
const router = express.Router();
const passport = require('passport');
const { callback } = require('../controllers/auth.controller')

router.get('/login', passport.authenticate('twitter'))
router.get('/sessions/callback', passport.authenticate('twitter', {
    failureRedirect: '/auth/login'
}), callback )

module.exports = router;