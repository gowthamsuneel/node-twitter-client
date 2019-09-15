const express = require('express');
const router = express.Router();
const { sharedLinks, filter, hashTag, getDBTweets } = require('../controllers/twitter.controller')
/* GET home page. */
router.get('/links', sharedLinks);
router.post('/filter', filter);
router.post('/hashtag', hashTag);
router.get('/data', getDBTweets);



module.exports = router;
