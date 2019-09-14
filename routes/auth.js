const express = require('express');
const router = express.Router();
const passport = require('passport');
const { getTweetsFromTwitterAPI } = require('./twitter')
router.get('/', function(req, res) {
    res.json({user: req.user})
    getTweetsFromTwitterAPI({count : 200});
})

router.get('/login', passport.authenticate('twitter'))

router.get('/sessions/callback', passport.authenticate('twitter', {
    failureRedirect: '/'
}), function(req, res) {
    res.redirect('/auth')
})

module.exports = router;