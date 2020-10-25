const { Router } = require("express");
const router = Router();
const passport = require('passport');

const playlistService = require('./service');

const scopesValidationHandler = require('../../../utils/middleware/scopesValidationHandler');

// JWT Strategy
require('../../../utils/auth/strategies/jwt');

function playlistRoutes(app, store) {
    const PlaylistService = playlistService(store);
    app.use('/api/playlist', router);

    router.post('/',
        //passport.authenticate('jwt', { session: false }),
        //scopesValidationHandler(['create:playlists']),
        PlaylistService.createPlaylist);
    router.put('/:playlistId',
        //passport.authenticate('jwt', { session: false }),
        //scopesValidationHandler(['update:playlists']),
        PlaylistService.updatePlaylist);
    router.delete('/:playlistId',
        //passport.authenticate('jwt', { session: false }),
        //scopesValidationHandler(['delete:playlists']),
        PlaylistService.deletePlaylist);
    router.get('/',
        //passport.authenticate('jwt', { session: false }),
        //scopesValidationHandler(['read:playlists']),
        PlaylistService.getPlaylists);
    router.get('/:playlistId',
        //passport.authenticate('jwt', { session: false }),
        //scopesValidationHandler(['read:playlists']),
        PlaylistService.getPlaylist);
    router.put('/:playlistId/addTrack',
        //passport.authenticate('jwt', { session: false }),
        //scopesValidationHandler(['update:playlists']),
        PlaylistService.addPlaylistTrack);
    router.put('/:playlistId/deleteTrack/:trackId',
        //passport.authenticate('jwt', { session: false }),
        //scopesValidationHandler(['update:playlists']),
        PlaylistService.deletePlaylistTrack);
    router.get('/favorites',
        //passport.authenticate('jwt', { session: false }),
        //scopesValidationHandler(['update:playlists']),
        playlistService.getFavorites);
}

module.exports = playlistRoutes;