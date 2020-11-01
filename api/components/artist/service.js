const response = require('../../../utils/response');
const controller = require('./controller');
const boom = require('boom');
function artistService(injectedStore) {
    let store = injectedStore;
    const Controller = controller(store);

    const getArtists = async (req, res, next) => {
        try {
            const page = parseInt(req.query.page);
            const artists = await Controller.getArtists(page);
            response.success(req, res, artists, 200);
        } catch (error) {
            next(boom.boomify(error, { statusCode: 500 }));
        }
    }

    const getArtist = async (req, res, next) => {
        const { params } = req;
        try {
            const artist = await Controller.getArtist({_id:params.artistId});
            if (artist) {
                response.success(req, res, artist, 200);
            } else {
                response.error(req, res, [{
                    "msg": "Artist not found",
                    "param": "ARTIST_NOT_FOUND"
                }], 400);
            }
        } catch (error) {
            next(boom.boomify(error, { statusCode: 500 }));
        }
    };

    const createArtist = async (req, res, next) => {
        const { body: data } = req;
        try {
            const createdArtist = await Controller.createArtist(data);
            response.success(req, res, createdArtist, 201);
        } catch (error) {
            next(boom.boomify(error, { statusCode: 500 }));
        }
    };

    const updateArtist = async (req, res, next) => {
        const { params } = req;
        const { body: data } = req;
        try {
            const updatedArtist = await Controller.updateArtist(params.artistId, data);
            if (!updatedArtist) response.error(req, res, [{
                "msg": "Artist not found",
                "param": "ARTIST_NOT_FOUND"
            }], 400);
            response.success(req, res, updatedArtist, 200);
        } catch (error) {
            next(boom.boomify(error, { statusCode: 500 }));
        }
    };

    const deleteArtist = async (req, res, next) => {
        const { params } = req;
        try {
            const deletedArtist = await Controller.deleteArtist(params.artistId);
            if (!deletedArtist) response.error(req, res, [{
                "msg": "Artist not found",
                "param": "ARTIST_NOT_FOUND"
            }], 400);
            response.success(req, res, deletedArtist, 201);
        } catch (error) {
            next(boom.boomify(error, { statusCode: 500 }));
        }
    };


    return {
        createArtist,
        updateArtist,
        deleteArtist,
        getArtists,
        getArtist
    }
}

module.exports = artistService;