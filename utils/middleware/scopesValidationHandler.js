const response = require('../response');
const boom = require('boom');

function scopesValidationHandler(allowedScopes) {
    return (req, res, next) => {
        if (!req.user || (req.user && !req.user.scopes)) {
            // next(response.error(req, res, [{
            //     "msg": "Missing Scopes",
            //     "param": "MISSING_SCOPES"
            // }], 401));
            next(boom.unauthorized('Insufficient Scopes'));
        }

        const permissions = allowedScopes
            .map(scope => req.user.scopes.includes(scope));
        
        const hasAccess = !permissions.includes(false);
            
        if (hasAccess) {
            next();
        } else {
          response.error(req,res,'Missing Scopes',401);
        }
    }
}

module.exports = scopesValidationHandler;