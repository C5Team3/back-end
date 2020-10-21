const store = require('../../../models/artists');
const controller = require('./controller');

module.exports = controller(store);