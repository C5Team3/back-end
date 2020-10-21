const store = require('../../../models/albums');
const controller = require('./controller');

module.exports = controller(store);