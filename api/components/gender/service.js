const response = require('../../../utils/response');
const controller = require('./controller');

function genderService(injectedStore) {
    let store = injectedStore;
    const Controller = controller(store);

    const getGenders = async (req, res, next) => {
        try {
            const artists = await Controller.getGenders();
            response.success(req, res, artists, 200);
        } catch (error) {
            next(error);
        }
    }

    const getGender = async (req, res, next) => {
        const { params } = req;
        try {
            const gender = await Controller.getGender(params.genderId);
            if (gender) {
                response.success(req, res, user, 200);
            } else {
                response.error(req, res, [{
                    "msg": "Gender not found",
                    "param": "GENDER_NOT_FOUND"
                }], 400);
            }
        } catch (error) {
            next(error);
        }
    };

    const createGender = async (req, res, next) => {
        const { body: data } = req;
        try {
            const createdGender = await Controller.createGender(data);
            response.success(req, res, createdGender, 201);
        } catch (error) {
            next(error);
        }
    };

    const updateGender = async (req, res, next) => {
        const { params } = req;
        const { body: data } = req;
        try {
            const updatedGender = await Controller.updateGender(params.genderId, data);
            if (!updatedGender) response.error(req, res, [{
                "msg": "Gender not found",
                "param": "GENDER_NOT_FOUND"
            }], 400);
            response.success(req, res, updatedGender, 200);
        } catch (error) {
            next(error);
        }
    };

    const deleteGender = async (req, res, next) => {
        const { params } = req;
        try {
            const deletedGender = await Controller.deleteGender(params.genderId);
            if (!deletedGender) response.error(req, res, [{
                "msg": "Gender not found",
                "param": "GENDER_NOT_FOUND"
            }], 400);
            response.success(req, res, deletedGender, 201);
        } catch (error) {
            next(error);
        }
    };


    return {
        createGender,
        updateGender,
        deleteGender,
        getGender,
        getGenders
    }
}

module.exports = genderService;