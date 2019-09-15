const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  mongodbURL : process.env.MONGO_URI,
  consumerKey: process.env.consumerKey,
  consumerSecret: process.env.consumerSecret,
  access_token: process.env.access_token,
  access_token_secret: process.env.access_token_secret,
  callbackURL: process.env.callbackURL,
  count: process.env.count 
};
