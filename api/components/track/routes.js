const { Router } = require("express");
const router = Router();
const passport = require('passport');

const trackService = require('./service');

const scopesValidationHandler = require('../../../utils/middleware/scopesValidationHandler'); 
const objectIdValidationHandler = require('../../../utils/middleware/objectIdValidationHanlder'); 
const { SIXTY_MINUTES } = require('../../../utils/time');
const cacheResponse = require('../../../utils/middleware/cacheResponse');


function trackRoutes(app, store){
  const TrackService = trackService(store);
  app.use('/api/track',router);

  router.get('/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:track']),
    cacheResponse(SIXTY_MINUTES),
    TrackService.getTracks
  )
  router.get('/:trackId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:track']),
    objectIdValidationHandler('trackId'),
    TrackService.getTrack
  )
  router.post('/', 
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['create:track']),
    TrackService.createTrack
  );
  router.put('/:trackId', 
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:track']),
    objectIdValidationHandler('trackId'),
    TrackService.updateTrack
  );
  router.delete('/:trackId', 
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['delete:track']),
    objectIdValidationHandler('trackId'),
    TrackService.deleteTrack
  );
}
module.exports = trackRoutes;
