const store = require('../../../models/spotPlaylists');
const controller = require('./controller');

module.exports = controller(store);