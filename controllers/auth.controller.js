const express = require('express');
const router = express.Router();
const passport = require('passport');
const { getTweetsFromTwitterAPI } = require('./twitter.controller')


let redirect = (req,res) =>{
    try {
        res.json({user: req.user})
        getTweetsFromTwitterAPI(req, {count : 200}); 
    } catch (err) {
       console.log(err); 
    }
}

let callback = (req,res) =>{
    try {
        redirect(req,res) 
    } catch (err) {
        console.log(err); 
    }
}

// router.get('/login', passport.authenticate('twitter'))

// router.get('/sessions/callback', passport.authenticate('twitter', {
//     failureRedirect: '/'
// }), function(req, res) {
//     res.redirect('/auth')
// })

module.exports = {redirect, callback};