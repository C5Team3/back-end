const { Router } = require("express");
const router = Router();
const passport = require('passport');

const albumService = require('./service');

const scopesValidationHandler = require('../../../utils/middleware/scopesValidationHandler'); 
const objectIdValidationHandler = require('../../../utils/middleware/objectIdValidationHanlder'); 

function albumRoutes(app, store){
  const AlbumService = albumService(store);
  app.use('/api/album',router);

  router.get('/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:album']),
    AlbumService.getAlbums
  )
  router.get('/:albumId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:album']),
    objectIdValidationHandler('albumId'),
    AlbumService.getAlbum
  )
  router.post('/', 
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['create:album']),
    AlbumService.createAlbum
  );
  router.put('/:albumId', 
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['update:album']),
    objectIdValidationHandler('albumId'),
    AlbumService.updateAlbum
  );
  router.delete('/:albumId', 
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['delete:album']),
    objectIdValidationHandler('albumId'),
    AlbumService.deleteAlbum
  );
}
module.exports = albumRoutes;
