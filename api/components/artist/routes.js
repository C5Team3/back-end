const { Router } = require("express");
const router = Router();
const passport = require('passport');

const artistService = require('./service');

const scopesValidationHandler = require('../../../utils/middleware/scopesValidationHandler');

// JWT Strategy
require('../../../utils/auth/strategies/jwt');

function artistRoutes(app, store) {
    const ArtistService = artistService(store);
    app.use('/api/artist', router);

    router.post('/',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['create:artist']),
        ArtistService.createArtist);
    router.put('/:artistId',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['update:artist']),
        ArtistService.updateArtist);
    router.delete('/:artistId',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['delete:artist']),
        ArtistService.deleteArtist);
    router.get('/',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['read:artists']),
        ArtistService.getArtists);
    router.get('/:artistId',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['read:artist']),
        ArtistService.getArtist);
}

module.exports = artistRoutes;