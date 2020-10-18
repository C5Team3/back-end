const store = require('../../../models/users');
const controller = require('./controller');

module.exports = controller(store);