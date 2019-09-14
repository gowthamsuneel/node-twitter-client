const mongoose = require('mongoose');


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

const linksSchema = new mongoose.Schema({
    user: {
        type: Object
    },
    link : {
        type: Array,
    }
});

/**
 * @typedef Access
 */
let Twitter = mongoose.model('Twitter', twitterSchema);
let Links = mongoose.model('links', linksSchema);
module.exports = {Twitter, Links}
