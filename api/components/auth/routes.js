const { Router } = require("express");
const router = Router();
const passport = require('passport');

const authService = require('../../../api/components/auth/service');
const userModel = require('../../../models/users');
const apiKeysModel = require('../../../models/apiKey');

const AuthService = authService(userModel,apiKeysModel);

// Import Middle wares
// const scopesValidationHandler = require('../../../utils/middleware/scopesValidationHandler'); 
const objectIdValidationHandler = require('../../../utils/middleware/objectIdValidationHanlder'); 

require('../../../utils/auth/strategies/basic');

function authRoutes(app,store){
  // const UserService = userService(store);
  app.use('/api/auth',router);
  
  router.post('/sign-in',
    passport.authenticate('basic', { session: false }),
    AuthService.sign_in   
  )
  router.get('/sign-up',
    // passport.authenticate('jwt', { session: false }),
  // scopesValidationHandler(['read:albums']),
    objectIdValidationHandler('albumId'),
    
  )
}
module.exports = authRoutes;
