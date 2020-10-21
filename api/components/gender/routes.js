const { Router } = require("express");
const router = Router();
const passport = require('passport');

const genderService = require('./service');

const scopesValidationHandler = require('../../../utils/middleware/scopesValidationHandler');

// JWT Strategy
require('../../../utils/auth/strategies/jwt');

function genderRoutes(app, store) {
    const GenderService = genderService(store);
    app.use('/api/gender', router);

    router.post('/',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['create:genders']),
        GenderService.createGender);
    router.put('/:genderId',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['update:genders']),
        GenderService.updateGender);
    router.delete('/:genderId',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['delete:genders']),
        GenderService.deleteGender);
    router.get('/',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['read:genders']),
        GenderService.getGender);
    router.get('/:genderId',
        passport.authenticate('jwt', { session: false }),
        scopesValidationHandler(['read:genders']),
        GenderService.getGender);
}

module.exports = genderRoutes;