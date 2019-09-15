const express = require('express');
const router = express.Router();
const { sharedLinks, filter, hashTag, getDBTweets } = require('../controllers/twitter.controller')
/* GET home page. */
router.get('/links', sharedLinks);
router.post('/filter', filter);
router.get('/hashtag', hashTag);
router.get('/tweets', getDBTweets);



module.exports = router;
