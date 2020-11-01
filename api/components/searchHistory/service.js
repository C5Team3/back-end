const response = require('../../../utils/response');
const controller = require('./controller');
const boom = require('boom');

function searchHistoryService(injectedStore) {
    let store = injectedStore;
    const Controller = controller(store);

    const search = async (req, res, next) => {
        const { params } = req;
        const user = req.user._doc;
        try {
            const searchResult = await Controller.search(params.filterText, user._id);
            response.success(req, res, searchResult, 200);
        } catch (error) {
            next(boom.boomify(error, { statusCode: 500 }));
        }
    }

    const lastSearches = async (req, res, next) => {
        const user = req.user._doc;
        try {
            const lastResults = await Controller.getLastSearchs(user._id);
            response.success(req, res, lastResults, 200);
        } catch (error) {
            next(boom.boomify(error, { statusCode: 500 }));
        }
    }

    const topSearched = async (req, res, next) => {
        try {
            const topResults = await Controller.getTopSearches();
            response.success(req, res, topResults, 200);
        } catch (error) {
            next(boom.boomify(error, { statusCode: 500 }));
        }
    }

    return {
        search,
        lastSearches,
        topSearched
    }
}

module.exports = searchHistoryService;