const { Router } = require("express");
const router = Router();
const passport = require('passport');

const trackService = require('./service');

// const scopesValidationHandler = require('../../../utils/middleware/scopesValidationHandler'); 
const objectIdValidationHandler = require('../../../utils/middleware/objectIdValidationHanlder'); 

function trackRoutes(app, store){
  const TrackService = trackService(store);
  app.use('/api/track',router);

  router.get('/',
  // passport.authenticate('jwt', { session: false }),
  // scopesValidationHandler(['read:tracks']),
    TrackService.getTracks
  )
  router.get('/:trackId',
    // passport.authenticate('jwt', { session: false }),
  // scopesValidationHandler(['read:tracks']),
    objectIdValidationHandler('trackId'),
    TrackService.getTrack
  )
  router.post('/', 
    // passport.authenticate('jwt', { session: false }),
    // scopesValidationHandler(['create:tracks']),
    TrackService.createTrack
  );
  router.put('/:trackId', 
  // passport.authenticate('jwt', { session: false }),
  // scopesValidationHandler(['read:tracks']),
    objectIdValidationHandler('trackId'),
    TrackService.updateTrack
  );
  router.delete('/:trackId', 
    // passport.authenticate('jwt', { session: false }),
    // scopesValidationHandler(['delete:tracks']),
    objectIdValidationHandler('trackId'),
    TrackService.deleteTrack
  );
}
module.exports = trackRoutes;
