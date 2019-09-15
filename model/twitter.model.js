const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

/**
 * Access Schema
 * @private
 */
const twitterSchema = new mongoose.Schema({
    user: {
        type: Object
    },
    text : {
        type: String,
    },
    entities : {
        type: Object
    },
    id : {
        type : String
    }
});

/** Links  */
const linksSchema = new mongoose.Schema({
    user: {
        type: Object
    },
    link : {
        type: Array,
    }
});

/** User tokens */
const tokenSchema = new mongoose.Schema({
    user: {
        type: String
    },
    token : {
        type: String,
    },
    token_secret : {
        type: String,
    }
});

/**
 * @typedef Access
 */
let Twitter = mongoose.model('tweets', twitterSchema);
let Links = mongoose.model('links', linksSchema);
let Tokens = mongoose.model('tokens', tokenSchema);
module.exports = { Twitter, Links, Tokens}
