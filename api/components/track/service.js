const response = require('../../../utils/response');
const controller = require('./controller');


function trackService(injectedStore) {
    let store = injectedStore;
    const Controller = controller(store);

    const getTracks = async (req, res, next) => {
        try {
            const tracks = await Controller.getTracks();
            response.success(req, res, tracks, 200);
        } catch (error) {
            next(error);
        }
    }

    const getTrack = async (req, res, next) => {
        const { params } = req;
        try {
            const track = await Controller.getTrack(params.trackId);
            if (track) {
                response.success(req, res, track, 200);
            } else {
                response.error(req, res, [{
                    "msg": "Track not found",
                    "param": "Track_NOT_FOUND"
                }], 400);
            }
        } catch (error) {
            next(error);
        }
    };

    const createTrack = async (req, res, next) => {
        const { body: data } = req;
        try {
            const createdTrack = await Controller.createTrack(data);
            response.success(req, res, createdTrack, 201);
        } catch (error) {
            next(error);
        }
    };

    const updateTrack = async (req, res, next) => {
        const { params } = req;
        const { body: data } = req;    
        try {
            const updatedTrack = await Controller.updateTrack(params.trackId, data);
            if (!updatedTrack){
              response.error(req, res, [{
                "msg": "Track not found",
                "param": "TRACK_NOT_FOUND"
              }], 400);
            }
            else{
              response.success(req, res, updatedTrack, 200);
            }
        } catch (error) {
            next(error);
        }
    };

    const deleteTrack = async (req, res, next) => {
        const { params } = req;
        try {
            const deletedTrack = await Controller.deleteTrack(params.trackId);
            if (!deletedTrack) {
              response.error(req, res, [{"msg": "Track not found","param": "TRACK_NOT_FOUND"}], 400);
            }else{
              response.success(req, res, deletedTrack, 201);
            }
        } catch (error) {
            next(error);
        }
    };

    const getOrCreateTrack = async (req,res, next) => {
        try {
            const trackData = req.body;
            const track = await Controller.getOrCreatetrack(trackData);
            return track || false;
        } catch (error) {
            next(error);
        }
    }

    return {
        createTrack,
        updateTrack,
        deleteTrack,
        getTracks,
        getTrack,
        getOrCreateTrack
    }
}

module.exports = trackService;