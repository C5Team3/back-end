// DEBUG=app:* node ./scripts/seedApiKeys.js

const chalk = require('chalk');
const debug = require('debug')('app:scripts:seed-users');
const db = require('../lib/db');
const config = require('../config/index');
const userModel = require('../models/users');
const UserController = require('../api/components/user/controller');
const userController = UserController(userModel);

let usersFixtures = require('../utils/fixtures/users');

const adminUser = 
  {
    "name": config.default_admin_user_name,
    "email": config.default_admin_user_email,
    "password": config.default_admin_user_password,
    "avatarPath": "https://cdn.iconscout.com/icon/free/png-256/avatar-370-456330.png"
}
usersFixtures.push(adminUser);

async function seedUsers() {
  try {
    // const MONGO_URI_OVERRIDE = `mongodb://127.0.0.1:27017/music_app_test`;
    // db.connect(MONGO_URI_OVERRIDE);
    db.connect();
    const promises = usersFixtures.map(async (user) => {
      await userController.createUser(user);
    });

    await Promise.all(promises);
    debug(chalk.green(`${promises.length} Users has been created successfully`)); // prettier-ignore
    debug(chalk.red(`Please Remember: Admin User is: ${adminUser.email} ${adminUser.password}`));
    return process.exit(0);
  } catch (error) {
    debug(chalk.red(error));
    process.exit(1);
  }
}
seedUsers();
