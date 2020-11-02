const boom = require('boom');

const response = require('../../../utils/response');
const controller = require('./controller');
const userController = require('../user/controller');
const userModel = require('../../../models/users');


function playlistService(injectedStore) {

    let store = injectedStore;
    const Controller = controller(store);

    const getPlaylists = async (req, res, next) => {
        try {
            const user = req.user._doc;
            const playlists = await Controller.getPlaylists(user._id);
            response.success(req, res, playlists, 200);
        } catch (error) {
            next(boom.boomify(error, { statusCode: 400 }));
        }
    }

    const getPlaylist = async (req, res, next) => {
        const { params } = req;
        const user = req.user._doc;
        try {
            const playlist = await Controller.getPlaylist(params.playlistId, user._id);
            if (playlist) {
                response.success(req, res, playlist, 200);
            } else {
                response.error(req, res, [{
                    "msg": "Playlist not found",
                    "param": "PLAYLIST_NOT_FOUND"
                }], 400);
            }
        } catch (error) {
            next(boom.boomify(error, { statusCode: 400 }));
        }
    };

    const createPlaylist = async (req, res, next) => {
        const { body: data } = req;
        const user = req.user._doc;
        try {
            const createdPlaylist = await Controller.createPlaylist(data, user._id);
            response.success(req, res, createdPlaylist, 201);
        } catch (error) {
            next(boom.boomify(error, { statusCode: 500 }));
        }
    };

    const updatePlaylist = async (req, res, next) => {
        const { params } = req;
        const { body: data } = req;
        try {
            const updatedPlaylist = await Controller.updatePlaylist(params.playlistId, data);
            if (!updatedPlaylist) response.error(req, res, [{
                "msg": "Playlist not found",
                "param": "PLAYLIST_NOT_FOUND"
            }], 400);
            response.success(req, res, updatedPlaylist, 200);
        } catch (error) {
            next(boom.boomify(error, { statusCode: 500 }));
        }
    };

    const deletePlaylist = async (req, res, next) => {
        const { params } = req;
        try {
            const deletedPlaylist = await Controller.deletePlaylist(params.playlistId);
            if (!deletedPlaylist) response.error(req, res, [{
                "msg": "Playlist not found",
                "param": "PLAYLIST_NOT_FOUND"
            }], 400);
            response.success(req, res, deletedPlaylist, 201);
        } catch (error) {
            next(boom.boomify(error, { statusCode: 500 }));
        }
    };

    const addPlaylistTrack = async (req, res, next) => {
        const { playlistId } = req.params;
        const { body: data } = req;
        try {
            const playlistExist = await Controller.getPlaylist(playlistId);
            if (!playlistExist)
                response.error(req, res, [{
                    "msg": "Playlist not found",
                    "param": "PLAYLIST_NOT_FOUND"
                }], 400);

            console.log('data: ', data);

            const addedTrack = await Controller.addPlaylistTrack(playlistId, data.trackId);
            
            response.success(req, res, addedTrack, 200);
        } catch (error) {
            next(boom.boomify(error, { statusCode: 500 }));
        }
    };

    const deletePlaylistTrack = async (req, res, next) => {
        const { playlistId, trackId } = req.params;
        try {
            const deletedItem = await Controller.deletePlaylistTrack(playlistId, trackId);
            if (!deletedItem) response.error(req, res, [{
                "msg": "Track not found",
                "param": "TRACK_NOT_FOUND"
            }], 400);
            response.success(req, res, deletedItem, 201);
        } catch (error) {
            next(boom.boomify(error, { statusCode: 500 }));
        }
    };

    const createFavPlaylist = async (userId) => {
        const UserController = userController(userModel);
        try {
            const user = await UserController.getUser({ _id: userId });
            if (!user)
                next(boom.boomify("User not found", { statusCode: 400 }));

            const favoritePlaylist = await Controller.createFavPlaylist(user);
            if (!favoritePlaylist)
                next(boom.internal("fav playlist can't be created", { statusCode: 500 }));

            return favoritePlaylist;
        } catch (error) {
            next(boom.boomify(error, { statusCode: 500 }));
        }
    };

    const getFavorites = async (req, res, next) => {
        const user = req.user._doc;
        try {
            const userFavs = await Controller.getFavorites(user._id);
            if (!userFavs)
                response.error(req, res, [{
                    "msg": "Playlist not found",
                    "param": "PLAYLIST_NOT_FOUND"
                }], 400);
            else
                response.success(req, res, userFavs, 200);
        } catch (error) {
            next(boom.boomify(error, { statusCode: 500 }));
        }
    }

    const subscribe = async (req, res, next) => {
        const { params } = req;
        const user = req.user._doc;
        try {
            const subscribe = await Controller.subscribe(params.playlistId, user._id);
            if (!subscribe)
                response.error(req, res, [{
                    "msg": "Playlist not found",
                    "param": "PLAYLIST_NOT_FOUND"
                }], 400);

            response.success(req, res, subscribe, 200);
        } catch (error) {
            next(boom.boomify(error, { statusCode: 500 }));
        }
    }

    const unsubscribe = async (req, res, next) => {
        const { params } = req;
        const user = req.user._doc;
        try {
            const unsubscribe = await Controller.unsubscribe(params.playlistId, user._id);
            if (!unsubscribe)
                response.error(req, res, [{
                    "msg": "Playlist not found",
                    "param": "PLAYLIST_NOT_FOUND"
                }], 400);

            response.success(req, res, unsubscribe, 200);
        } catch (error) {
            next(boom.boomify(error, { statusCode: 500 }));
        }
    }

    const getGeneralTop = async (req, res, next) => {
        try {
            const generalTop = await Controller.getGeneralTop();
            if (!generalTop)
                response.error(req, res, [{
                    "msg": "Playlist not found",
                    "param": "PLAYLIST_NOT_FOUND"
                }], 400);
            else
                response.success(req, res, generalTop, 200);
        } catch (error) {
            next(boom.boomify(error, { statusCode: 500 }));
        }
    }

    const addFavoritesTrack = async (req, res, next) => {
        const user = req.user._doc;
        const { trackId } = req.params;
        try {
            const userFav = await Controller.getFavorites(user._id);
            if (!userFav)
                response.error(req, res, [{
                    "msg": "Playlist not found",
                    "param": "PLAYLIST_NOT_FOUND"
                }], 400);

            const addedTrack = await Controller.addPlaylistTrack(userFav._id, trackId);
            
            response.success(req, res, addedTrack, 200);
        } catch (error) {
            next(boom.boomify(error, { statusCode: 500 }));
        }
    }

    return {
        createPlaylist,
        updatePlaylist,
        deletePlaylist,
        getPlaylists,
        getPlaylist,
        addPlaylistTrack,
        deletePlaylistTrack,
        createFavPlaylist,
        getFavorites,
        subscribe,
        unsubscribe,
        getGeneralTop,
        addFavoritesTrack
    }
}

module.exports = playlistService;