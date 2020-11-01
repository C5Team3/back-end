// DEBUG=app:* node ./scripts/seedApiKeys.js

const chalk = require('chalk');
const debug = require('debug')('app:scripts:api-keys');
const db = require('../lib/db');
const config = require('../config/index');

const apiKey = require('../models/apiKey');
const apiKeyController = require('../api/components/apiKey/controller');
const ApiKeyController = apiKeyController(apiKey);

const generateRandomToken = require('../utils/generators/genRandomKey');


const adminScopes = [
  
  'sign_in:auth',
  'sign_up:auth',
  'sign_provider:auth',

  'read:album',
  'read:albums',
  'create:album',
  'update:album',
  'delete:album',
  
  'read:artist',
  'read:artists',
  'create:artist',
  'update:artist',
  'delete:artist',
  
  'read:track',
  'read:tracks',
  'create:track',
  'update:track',
  'delete:track',

  'read:user',
  'read:users',
  'create:user',
  'update:user',
  'delete:user',

  'create:playlists',
  'update:playlists',
  'delete:playlists',
  'read:playlists',

  'read:searchHistory'
];


const publicScopes = [
  'sign_in:auth',
  'sign_up:auth',
  'sign_provider:auth',
  'read:album',  
  'read:artist',
  'read:artists',
  'read:gender', 
  'read:track',
  'read:tracks',
  'read:user',
  'update:user',
  'create:playlists',
  'update:playlists',
  'delete:playlists',
  'read:playlists',
  'read:searchHistory'
]

const apiKeys = [
  {
    token: generateRandomToken(32),
    scopes: adminScopes,
    type:"ADMIN_SCOPE",
  },
  {
    token: generateRandomToken(32),
    scopes: publicScopes,
    type:"PUBLIC_SCOPE",
  }
];


async function seedApiKeys() {
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
    
      await ApiKeyController.emptyApiKeys();
      const promises = apiKeys.map(async apiKey => {
      await ApiKeyController.createApiKey(apiKey);
    });

    await Promise.all(promises);
    debug(chalk.green(`${promises.length} api keys have been created succesfully`)); // prettier-ignore
    const newApiKeys = await ApiKeyController.getApiKeys();
    debug(chalk.red(`${newApiKeys}`));
    return process.exit(0);
  } catch (error) {
    debug(chalk.red(error));
    process.exit(1);
  }
}

seedApiKeys();
