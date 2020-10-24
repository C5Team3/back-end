// DEBUG=app:* node ./scripts/seedApiKeys.js

const chalk = require('chalk');
const crypto = require('crypto');
const debug = require('debug')('app:scripts:api-keys');
const db = require('../lib/db');

const apiKey = require('../models/apiKey');
const apiKeyController = require('../api/components/apiKey/controller');
const ApiKeyController = apiKeyController(apiKey);


const adminScopes = [
  
  'sign_in:auth',
  'sign_up:auth',
  'sign_provider:auth',

  'read:albums',
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
  'create:user',
  'update:user',
  'delete:user',

];


const publicScopes = [
  'sign_in:auth',
  'sign_up:auth',
  'sign_provider:auth',
  'read:albums',  
  'read:artist',
  'read:gender', 
  'read:track',
  'read:user',
]

const apiKeys = [
  {
    token: generateRandomToken(),
    scopes: adminScopes,
    type:"ADMIN_SCOPE",
  },
  {
    token: generateRandomToken(),
    scopes: publicScopes,
    type:"PUBLIC_SCOPE",
  }
];


function generateRandomToken() {
  const buffer = crypto.randomBytes(32);
  return buffer.toString('hex');
}

async function seedApiKeys() {
  try {
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
