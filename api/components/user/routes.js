const { Router } = require('express');
const router = Router();
const passport = require('passport');

const userService = require('./service');

const scopesValidationHandler = require('../../../utils/middleware/scopesValidationHandler');

// JWT Strategy
require('../../../utils/auth/strategies/jwt');

function userRoutes(app, store) {
  const UserService = userService(store);
  app.use('/api/user', router);

  router.post(
    '/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['create:user']),
    UserService.createUser
  );
  router.put(
    '/:userId',
    passport.authenticate('jwt', { session: false }),
    
    scopesValidationHandler(['update:user']),
    UserService.updateUser
  );
  router.delete(
    '/:userId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['delete:user']),
    UserService.deleteUser
  );
  router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:users']),
    UserService.getUsers
  );
  router.get(
    '/:userId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:user']),
    UserService.getUser
  );
}

module.exports = userRoutes;