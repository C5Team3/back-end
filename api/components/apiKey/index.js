const store = require('../../../models/apiKey');
const controller = require('./controller');

module.exports = controller(store);