const mongoose = require('mongoose');
const debug = require('debug')('app:db:connect');
const chalk = require('chalk');

const { db_user, db_password, db_name, db_host  } = require('../config/index');

const USER = encodeURIComponent(db_user);
const PASSWORD = encodeURIComponent(db_password);
const HOST = db_host;

const MONGO_URI = `mongodb+srv://${USER}:${PASSWORD}@${HOST}/${db_name}?retryWrites=true&w=majority`

module.exports = {
  connection: null,
  connect: () => {
      if (this.connection) return this.connection;
      return mongoose.connect(MONGO_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
      }).then(connection => {
          this.connection = connection;
          debug(chalk.green('Success Full connection to DB'));
      }).catch(err => debug(chalk.red('err', err)));
  }
}