const response = require('../../../utils/response');
const controller = require('./controller');


function albumService(injectedStore) {
    let store = injectedStore;
    const Controller = controller(store);

    const getAlbums = async (req, res, next) => {
        try {
            const albums = await Controller.getAlbums();
            response.success(req, res, albums, 200);
        } catch (error) {
            next(error);
        }
    }

    const getAlbum = async (req, res, next) => {
        const { params } = req;
        try {
            const album = await Controller.getAlbum(params.albumId);
            if (album) {
                response.success(req, res, album, 200);
            } else {
                response.error(req, res, [{
                    "msg": "Album not found",
                    "param": "ALBUM_NOT_FOUND"
                }], 400);
            }
        } catch (error) {
            next(error);
        }
    };

    const createAlbum = async (req, res, next) => {
        const { body: data } = req;
        try {
            const createdAlbum = await Controller.createAlbum(data);
            response.success(req, res, createdAlbum, 201);
        } catch (error) {
            next(error);
        }
    };

    const updateAlbum = async (req, res, next) => {
        const { params } = req;
        const { body: data } = req;    
        try {
            const updatedAlbum = await Controller.updateAlbum(params.albumId, data);
            if (!updatedAlbum){
              response.error(req, res, [{
                "msg": "Album not found",
                "param": "ALBUM_NOT_FOUND"
              }], 400);
            }
            else{
              response.success(req, res, updatedAlbum, 200);
            }
        } catch (error) {
            next(error);
        }
    };

    const deleteAlbum = async (req, res, next) => {
        const { params } = req;
        try {
            const deletedAlbum = await Controller.deleteAlbum(params.albumId);
            if (!deletedAlbum) {
              response.error(req, res, [{"msg": "Album not found","param": "ALBUM_NOT_FOUND"}], 400);
            }else{
              response.success(req, res, deletedAlbum, 201);
            }
        } catch (error) {
            next(error);
        }
    };

    const getOrCreateAlbum = async (req,res, next) => {
        try {
            const albumData = req.body;
            const album = await Controller.getOrCreatealbum(albumData);
            return album || false;
        } catch (error) {
            next(error);
        }
    }

    return {
        createAlbum,
        updateAlbum,
        deleteAlbum,
        getAlbums,
        getAlbum,
        getOrCreateAlbum
    }
}

module.exports = albumService;