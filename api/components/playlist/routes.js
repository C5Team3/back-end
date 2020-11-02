const { Router } = require("express");
const router = Router();
const passport = require('passport');

const playlistService = require('./service');

const scopesValidationHandler = require('../../../utils/middleware/scopesValidationHandler');
const objectIdValidationHandler = require('../../../utils/middleware/objectIdValidationHanlder');
const { FIVE_MINUTES, SIXTY_MINUTES } = require('../../../utils/time');
const cacheResponse = require('../../../utils/middleware/cacheResponse');

// JWT Strategy
require('../../../utils/auth/strategies/jwt');

function playlistRoutes(app, store) {
    const PlaylistService = playlistService(store);
    app.use('/api/playlist', router);

    router.post('/',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['create:playlists']),
        PlaylistService.createPlaylist);
    router.put('/:playlistId',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['update:playlists']),
        PlaylistService.updatePlaylist);
    router.delete('/:playlistId',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['delete:playlists']),
        objectIdValidationHandler('playlistId'),
        PlaylistService.deletePlaylist);
    router.get('/',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['read:playlists']),
        cacheResponse(SIXTY_MINUTES),
        PlaylistService.getPlaylists);
    router.get('/:playlistId',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['read:playlists']),
        objectIdValidationHandler('playlistId'),
        cacheResponse(FIVE_MINUTES),
        PlaylistService.getPlaylist);
    router.put('/:playlistId/addTrack',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['update:playlists']),
        objectIdValidationHandler('playlistId'),
        PlaylistService.addPlaylistTrack);
    router.put('/:playlistId/deleteTrack/:trackId',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['update:playlists']),
        objectIdValidationHandler('playlistId'),
        objectIdValidationHandler('trackId'),
        PlaylistService.deletePlaylistTrack);
    router.get('/favorites/all',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['read:playlists']),
        cacheResponse(SIXTY_MINUTES),
        PlaylistService.getFavorites);
    router.put('/:playlistId/subscribe',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['read:playlists']),
        objectIdValidationHandler('playlistId'),
        PlaylistService.subscribe);
    router.put('/:playlistId/unsubscribe',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['read:playlists']),
        objectIdValidationHandler('playlistId'),
        PlaylistService.unsubscribe);
    router.get('/general/top20',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['read:playlists']),
        cacheResponse(SIXTY_MINUTES),
        PlaylistService.getGeneralTop);

    router.put('/favorites/addTrack/:trackId',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['update:playlists']),
        objectIdValidationHandler('trackId'),
        PlaylistService.addFavoritesTrack);
}

module.exports = playlistRoutes;