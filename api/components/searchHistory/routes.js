const { Router } = require("express");
const router = Router();
const passport = require('passport');

const searchHistoryService = require('./service');

const scopesValidationHandler = require('../../../utils/middleware/scopesValidationHandler');
const { FIVE_MINUTES, SIXTY_MINUTES } = require('../../../utils/time');
const cacheResponse = require('../../../utils/middleware/cacheResponse');

function searchHistoryRoutes(app, store) {
    const SearchHistoryService = searchHistoryService(store);
    app.use('/api/search', router);

    router.get('/filter/:filterText',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['read:searchHistory']),
        cacheResponse(SIXTY_MINUTES),
        SearchHistoryService.search
    );

    router.get('/lastSearches',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['read:searchHistory']),
        SearchHistoryService.lastSearches
    );

    router.get('/topSearched',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['read:searchHistory']),
        cacheResponse(FIVE_MINUTES),
        SearchHistoryService.topSearched
    );
}

module.exports = searchHistoryRoutes;