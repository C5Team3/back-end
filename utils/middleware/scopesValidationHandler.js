const response = require('../response');

function scopesValidationHandler(allowedScopes) {
    return (req, res, next) => {
        if (!req.user || (req.user && !req.user.scopes)) {
            next(response.error(req, res, [{
                "msg": "Missing Scopes",
                "param": "MISSING_SCOPES"
            }], 401));
        }

        const permissions = allowedScopes
            .map(scope => req.user.scopes.includes(scope));
        
        const hasAccess = !permissions.includes(false);
            
        if (hasAccess) {
            next();
        } else {
            next(response.error(req, res, [{
                "msg": "Insufficient Scopes",
                "param": "INSUFFICIENT_SCOPES"
            }], 401));
        }
    }
}

module.exports = scopesValidationHandler;