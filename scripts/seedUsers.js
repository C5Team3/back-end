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
    
    if(config.db_test_mode=="true"){
      const db_test = config.db_local_test_url;
      debug(chalk.blue("Changing DB Mode to Testing, Connected to Test DB"));
      db.connect(db_test);
    }
    else{
      debug(chalk.red("Connected to Production DB"));
      db.connect();
    }
    
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
