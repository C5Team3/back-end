const { Router } = require('express');
const router = Router();
const passport = require('passport');

const authService = require('../../../api/components/auth/service');
const userModel = require('../../../models/users');
const apiKeysModel = require('../../../models/apiKey');

const AuthService = authService(userModel, apiKeysModel);
const objectIdValidationHandler = require('../../../utils/middleware/objectIdValidationHanlder');
const facebookTokenValidationHandler = require('../../../utils/middleware/facebookTokenValidationHandler');

require('../../../utils/auth/strategies/basic');

function authRoutes(app) {
  // const UserService = userService(store);
  app.use('/api/auth', router);

  /* -------------------------------------------------------------------------- */
  /*                                   signIn                                   */
  /* -------------------------------------------------------------------------- */

  router.post(
    '/sign-in',
    passport.authenticate('basic', { session: false }),
    AuthService.signIn
  );

  /* -------------------------------------------------------------------------- */
  /*                                   signUp                                   */
  /* -------------------------------------------------------------------------- */

  router.post('/sign-up', AuthService.signUp);
  // Basic Activation Account
  router.get(
    '/activate',
    objectIdValidationHandler(),
    AuthService.activateAccount
  );

  /* -------------------------------------------------------------------------- */
  /*                               signUpProvider                               */
  /* -------------------------------------------------------------------------- */
  router.post('/sign/provider', 
  facebookTokenValidationHandler(),
  AuthService.signProvider
  );

  /* -------------------------------------------------------------------------- */
  /*                               signUpProvider                               */
  /* -------------------------------------------------------------------------- */
  
  router.post('/recovery', 
  AuthService.recoveryPassword
  );
}
module.exports = authRoutes;
