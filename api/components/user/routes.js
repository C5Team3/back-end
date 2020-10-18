const { Router } = require("express");
const router = Router();
const passport = require('passport');

const userService = require('./service');

const scopesValidationHandler = require('../../../utils/middleware/scopesValidationHandler');

// JWT Strategy
require('../../../utils/auth/strategies/jwt');

function userRoutes(app, store) {
    const UserService = userService(store);
    app.use('/api/user', router);

    router.post('/', 
        passport.authenticate('jwt', { session: false }), 
        scopesValidationHandler(['create:users']),
        UserService.createUser);
    router.put('/:userId', 
        passport.authenticate('jwt', { session: false }), 
        scopesValidationHandler(['update:users']),
        UserService.updateUser);
    router.delete('/:userId', 
        passport.authenticate('jwt', { session: false }), 
        scopesValidationHandler(['delete:users']),
        UserService.deleteUser);
    router.get('/', 
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['read:users']),
        UserService.getUsers);
    router.get('/:userId', 
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['read:users']),
        UserService.getUser);
}

module.exports = userRoutes;