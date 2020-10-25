const store = require('../../../models/playlists');
const controller = require('./controller');

module.exports = controller(store);