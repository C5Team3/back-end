const response = require('../../../utils/response');
const controller = require('./controller');
const debug = require('debug')('app:user:service');
const boom = require('boom');

function userService(injectedStore) {
    let store = injectedStore;
    const Controller = controller(store);

    const getUsers = async (req, res, next) => {
        try {
            const users = await Controller.getUsers();
            response.success(req, res, users, 200);
        } catch (error) {
            next(error);
        }
    }

    const getUser = async (req, res, next) => {
        const { params } = req;
        try {
            const user = await Controller.getUser({_id:params.userId});
            if (user) {
                response.success(req, res, user, 200);
            } else {
                response.error(req, res, [{
                    "msg": "User not found",
                    "param": "USER_NOT_FOUND"
                }], 400);
            }
        } catch (error) {
            next(error);
        }
    };

    const createUser = async (req, res, next) => {
        const { body: data } = req;
        try {
            const createdUser = await Controller.createUser(data);
              if(createUser){
                response.success(req, res, createdUser, 201);
              }
              else{
                response.error(req, res, [{
                  "msg": "Fail to Create and User",
                  "param": "USER_NOT_FOUND"
              }], 400);
            }
        } catch (error) {
          if(error.code === 11000){
            return next(boom.unauthorized('Email Already Exist'));
          }
          next(boom.boomify(error, { statusCode: 400 }));      
        }
    };

    const updateUser = async (req, res, next) => {
        const { params } = req;
        const { body: data } = req;
        try {
            const updatedUser = await Controller.updateUser(params.userId, data);
            if (!updatedUser){
              response.error(req, res, [{
                  "msg": "User not found",
                  "param": "USER_NOT_FOUND"
              }], 400);
           }else{
            response.success(req, res, updatedUser, 200);
           }
            
              
        } catch (error) {
            next(error);
        }
    };

    const deleteUser = async (req, res, next) => {
        const { params } = req;
        try {
            const deletedUser = await Controller.deleteUser(params.userId);
            if (!deletedUser) {
              response.error(req, res, [{
                  "msg": "User not found",
                  "param": "USER_NOT_FOUND"
              }], 400);
            }
            else{
              response.success(req, res, deletedUser, 201);
            }
              
            
        } catch (error) {
            next(error);
        }
    };

    const verifyUser = async (email) => {
        const verifiedUser = await Controller.getUserByEmail(email);
        return verifiedUser || null;
    }

    const getOrCreateUser = async (userData) => {
        try {
            const user = await Controller.getOrCreateUser(userData);
            return user || false;
        } catch (error) {
            debug(error);
        }
    }

    return {
        createUser,
        updateUser,
        deleteUser,
        getUsers,
        getUser,
        verifyUser,
        getOrCreateUser
    }
}

module.exports = userService;