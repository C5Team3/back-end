const config = require('../../config');

function cacheResponse(seconds) {
    return (req, res, next) =>{
        if(!config.dev) {
            res.set("Cache-Control", `public, max-age=${seconds}`);
        }
        next();
    }
}

module.exports = cacheResponse;