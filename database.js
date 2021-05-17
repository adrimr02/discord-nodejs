const mongoose = require('mongoose');

const { config } =  require('./config/index');

const DBUSER = encodeURIComponent(config.dbUser,);
const DBPASSWORD = encodeURIComponent(config.dbPassword);
const DBHOST = encodeURIComponent(config.dbHost);
const DBNAME = encodeURIComponent(config.dbName);

const uri = `mongodb+srv://${DBUSER}:${DBPASSWORD}@${DBHOST}/${DBNAME}?retryWrites=true&w=majority`;

mongoose.connect(uri, {
  useFindAndModify: false,
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('DB is connected'))
  .catch(err => console.error(err));

module.exports = { mongoose, uri };