// DEBUG=app:* node ./scripts/seedApiKeys.js

const chalk = require('chalk');
const crypto = require('crypto');
const debug = require('debug')('app:scripts:api-keys');
const db = require('../lib/db');

// Models

// const apiKey = require('../models/apiKey');
// const apiKeyController = require('../api/components/apiKey/controller');
// const ApiKeyController = apiKeyController(apiKey);


async function seedSpotifyPlayList() {
  try {
      db.connect();
  } catch (error) {
    debug(chalk.red(error));
    process.exit(1);
  }
}

seedSpotifyPlayList();
