const response = require('../../../utils/response');
const userController = require('../user/controller');
const apiKeyController = require('../apiKey/controller');
const boom = require('boom');
const passport = require('passport');
const jwt = require("jsonwebtoken");
const config = require('../../../config/index');

// Basic strategy
require("../../../utils/auth/strategies/basic");


function authService(userModel, apiKeysModel) {
    let userStore = userModel;
    let apiKeysStore = apiKeysModel;
    const UserController = userController(userStore);
    const ApiKeyController = apiKeyController(apiKeysStore);

    const sign_in = async (req, res, next) => {
        try {
            const { apiKeyToken } = req.body;
            if(!apiKeyToken){
              return next(boom.unauthorized('Api Key is Required'));
            }            
            passport.authenticate("basic", async function(err,user){
              try{
                if(err || !user){
                 next(boom.unauthorized('Authenticate Process Failed'));
                }
                req.login(user, { session: false }, async function (err){      
                  if(err){
                    return next(err)
                  }
                });
                // Validate Apy Key
                const apiKey = await ApiKeyController.getApiKey({
                  token: apiKeyToken,
                });
                // If Api Key Is Invalid
                if (!apiKey) {
                  next(boom.unauthorized());
                }
                // Compose User Token
                const { _id, name, email } = user;
                const payload = {
                  sub: _id,
                  name,
                  email,
                  scopes: apiKey.scopes,
                };
                const token = jwt.sign(payload, config.auth_jwt_Secret, {
                  expiresIn: "30m",
                });
                const signedUser = {
                  userId: _id,
                  token: token,
                  ...payload,
                };
                delete signedUser.sub
                response.success(req, res, signedUser, 200,);
              }catch(error){
                boom.boomify(error, { statusCode: 500 });      
              }
            })(req,res,next);
            
        } catch (error) {
            next(boom.boomify(error,{statusCode:500}));
        }
    }

    return {
        sign_in,
    }
}

module.exports = authService;