const mongoose = require('mongoose');
const { mongodbURL } = require('./vars');

// set mongoose Promise to Bluebird
mongoose.Promise = Promise;

// Exit application on error
mongoose.connection.on('error', (err) => {
  console.log(`MongoDB connection error: ${err}`);
  process.exit(-1);
});


/**
* Connect to mongo db
*
* @returns {object} Mongoose connection
* @public
*/
exports.connect = () => {
  mongoose.connect(mongodbURL, {
    keepAlive: 1,
    useNewUrlParser: true,
  });
  return mongoose.connection;
};
