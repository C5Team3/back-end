// DEBUG=app:* node ./scripts/seedApiKeys.js

const chalk = require('chalk');
const crypto = require('crypto');
const debug = require('debug')('app:scripts:api-keys');
const db = require('../lib/db');

const apiKey = require('../models/apiKey');
const apiKeyController = require('../api/components/apiKey/controller');
const ApiKeyController = apiKeyController(apiKey);

const generateRandomToken = require('../utils/generators/genRandonKey');


const adminScopes = [
  
  'sign_in:auth',
  'sign_up:auth',
  'sign_provider:auth',

  'read:album',
  'create:album',
  'update:album',
  'delete:album',
  
  'read:artist',
  'create:artist',
  'update:artist',
  'delete:artist',

  'read:gender',              
  'create:gender',
  'update:gender',
  'delete:gender',
  
  'read:track',
  'create:track',
  'update:track',
  'delete:track',

  'read:user',
  'read:users',
  'create:user',
  'update:user',
  'delete:user',

];


const publicScopes = [
  'sign_in:auth',
  'sign_up:auth',
  'sign_provider:auth',
  'read:album',  
  'read:artist',
  'read:gender', 
  'read:track',
  'read:user',
  'update:user',
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
    // const MONGO_URI_OVERRIDE =`mongodb://127.0.0.1:27017/music_app_test`;
    // db.connect(MONGO_URI_OVERRIDE);
      db.connect();
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
