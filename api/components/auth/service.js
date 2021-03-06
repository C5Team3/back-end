const response = require('../../../utils/response');
const userController = require('../user/controller');
const apiKeyController = require('../apiKey/controller');
const Playlist = require('../../../models/playlists');
const playlistController = require('../playlist/controller');

const boom = require('boom');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../../config/index');
const nodemailer = require('nodemailer');
const composeActivateMessage = require('../../../utils/smtp/messages/activateAccount');
const composeRecoveryMessage = require('../../../utils/smtp/messages/recoveryAccount');
const genRandomPassword = require('../../../utils/generators/genRandomKey');
const debug = require('debug');
const chalk = require('chalk');
const bcrypt= require('bcrypt');

let transporter = nodemailer.createTransport({
  host: config.smtp_host,
  port: config.smtp_port,
  secure: true, // true for 465, false for other ports
  auth: {
    user: config.smtp_user, // generated ethereal user
    pass: config.smtp_password, // generated ethereal password
  },
});



// Basic strategy
require('../../../utils/auth/strategies/basic');

function authService(userModel, apiKeysModel) {
  let userStore = userModel;
  let apiKeysStore = apiKeysModel;
  const UserController = userController(userStore);
  const ApiKeyController = apiKeyController(apiKeysStore);

  /* -------------------------------------------------------------------------- */
  /*                                   signIn                                   */
  /* -------------------------------------------------------------------------- */

  const signIn = async (req, res, next) => {
    try {
      const { apiKeyToken } = req.body;
      if (!apiKeyToken) {
        return next(boom.unauthorized('Api Key is Required'));
      }
      passport.authenticate('basic', async function (err, user) {
        try {
          if (err || !user) {
            next(boom.unauthorized('Authenticate Process Failed'));
          }
          req.login(user, { session: false }, async function (err) {
            if (err) {
              return next(err);
            }
          });
          // Browse Api Key from BD
          const apiKey = await ApiKeyController.getApiKey({
            token: apiKeyToken,
          });

          // Validation for an Valid ApiKey
          if (apiKey.length == 0) {
            next(boom.unauthorized('Invalid Api Key Token'));
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
            expiresIn: '30m',
          });
          const signedUser = {
            userId: _id,
            token: token,
            ...payload,
          };
          delete signedUser.sub;
          response.success(req, res, signedUser, 200);
        } catch (error) {
          boom.boomify(error, { statusCode: 500 });
        }
      })(req, res, next);
    } catch (error) {
      next(boom.boomify(error, { statusCode: 500 }));
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                                   signUp                                   */
  /* -------------------------------------------------------------------------- */

  const signUp = async (req, res, next) => {
    const user = req.body;
    try {
      const findUser = await UserController.getUserByEmail(user.email);
      if (findUser) {
        next(boom.unauthorized('Email Already Exist'));
      } else {
        const  newUser= await UserController.createUser(user);
  
        //Create Favs playlist
        const PlaylistController = playlistController(Playlist);
        const favPlaylist = await PlaylistController.createFavPlaylist(newUser);
        if(favPlaylist) 
          newUser.favorites = favPlaylist;


        // Send Email for future Activation
        const message = composeActivateMessage(
          newUser.name,
          newUser.email,
          newUser._id
        );

        let sendResult = await transporter.sendMail(message);
        if (sendResult.messageId) {
          newUser.emailNotified = true;
        }
        response.success(req, res, newUser, 201);
      }
    } catch (error) {
      if (error.code === 11000) {
        return next(boom.unauthorized('Email Already Exist'));
      }
      next(boom.boomify(error, { statusCode: 500 }));
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                            Activate User Account                           */
  /* -------------------------------------------------------------------------- */

  const activateAccount = async (req, res, next) => {
    try {
      const { id } = req.query;
      const user = await UserController.getUser({ _id: id });
      if (user) {
        user.isActive = true;
        const activatedUser = await UserController.updateUser(id, user);
        response.success(req, res, activatedUser, 201);
      } else {
        response.error(
          req,
          res,
          [{ msg: 'User not found', param: 'USER_NOT_FOUND' }],
          400
        );
      }
    } catch (err) {
      next(boom.boomify(err, { statusCode: 400 }));
    }
  };

  /* -------------------------------------------------------------------------- */
  /*                      Sign Provider Facebook and Google                     */
  /* -------------------------------------------------------------------------- */

  const signProvider = async (req, res, next) => {
    const { apiKeyToken, ...userRequest} = req.body; 
    try {
      const user = await UserController.getOrCreateUser(userRequest);
      if(user){
        // Generate JWT
        if (!apiKeyToken) {
          return next(boom.unauthorized('Api Key is Required'));
        }
        // Browse Api Key from BD
        const apiKey = await ApiKeyController.getApiKey({
        token: apiKeyToken,
      });
      
      // Validation for an Valid ApiKey
      if (apiKey.length == 0) {
        next(boom.unauthorized('Invalid Api Key Token'));
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
          expiresIn: '30m',
        });
        const signedUser = {
          userId: _id,
          token: token,
          ...payload,
        };
        delete signedUser.sub;
        
        response.success(req, res, signedUser, 200);
      }
    } catch (error) {
      next(boom.boomify(error, { statusCode: 500 }));
    }
  };


/* -------------------------------------------------------------------------- */
/*                              Recovery Password                             */
/* -------------------------------------------------------------------------- */

const recoveryPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await UserController.getUser({email:email});
    const userId = user._id;
    const newPassword = genRandomPassword(8);
    user.password = await bcrypt.hash(newPassword, 12);
    
    delete user._id
    if (user) {
      const updatedUser = await UserController.updateUser(userId, user);

      // Sending  Email for recovery 
      const message = composeRecoveryMessage(
        updatedUser.name,
        updatedUser.email,
        newPassword,
      );
      updatedUser.emailNotified =false; 

      let sendResult = await transporter.sendMail(message);

      if (sendResult.messageId) {
        updatedUser.emailNotified = true;
      }
      debug(chalk("Failed Sending Email for Recovery Account"));
      
      response.success(req, res,'New Password Has been Generate', 200);


    } else {
      response.error(
        req,
        res,
        [{ msg: 'User not found', param: 'USER_NOT_FOUND' }],
        400
      );
    }
  } catch (err) {
    next(boom.boomify(err, { statusCode: 400 }));
  }
};


  return {
    signIn,
    signUp,
    activateAccount,
    signProvider,
    recoveryPassword
  };
}

module.exports = authService;