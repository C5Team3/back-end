const { Router } = require("express");
const router = Router();
const passport = require('passport');

const authService = require('../../../api/components/auth/service');
const userModel = require('../../../models/users');
const apiKeysModel = require('../../../models/apiKey');

const AuthService = authService(userModel,apiKeysModel);
const objectIdValidationHandler = require('../../../utils/middleware/objectIdValidationHanlder');

require('../../../utils/auth/strategies/basic');

function authRoutes(app){
  // const UserService = userService(store);
  app.use('/api/auth',router);
  
  router.post('/sign-in',
    passport.authenticate('basic', { session: false }),
    AuthService.signIn   
  );
  router.post('/sign-up',
    AuthService.signUp, 
  );
  // Basic Activation Account 
  router.post('/activate',
    objectIdValidationHandler(),
    AuthService.activateAccount, 
  );
  
}
module.exports = authRoutes;
