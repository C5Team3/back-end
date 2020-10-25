const response = require('../../../utils/response');
const userController = require('../user/controller');
const apiKeyController = require('../apiKey/controller');
const boom = require('boom');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../../../config/index');
const nodemailer = require('nodemailer');
const composeActivateMessage = require('../../../utils/smtp/messages/activateAccount');

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
          if (apiKey.length==0) {
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
        const idNewUser = await UserController.createUser(user);
        const newUser = {
          id: idNewUser,
        };
        // Send Email for future Activation
        const message = composeActivateMessage(user.name, user.email, newUser.id);
        let sendResult = await transporter.sendMail(message);
        if (sendResult.messageId) {
          newUser.emailNotified = true;
        }
        response.success(req, res, 'Success', 201, newUser);
      }
    } catch (error) {
      if (error.code === 11000) {
        return next(boom.unauthorized('Email Already Exist'));
      }
      next(boom.boomify(error, { statusCode: 400 }));
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

  const signUpProvider = async (req, res, next) => {
    const user = req.body;
    try {
        const findUser = await UserController.getUserByEmail(user.email);
        if (findUser) {
          next(boom.unauthorized('Email Already Exist'));
        } else {
          const idNewUser = await UserController.createUser(user);
          const newUser = {
            id: idNewUser,
          };
          // Send Email for future Activation
          const message = composeActivateMessage(user.name, user.email, newUser.id);
          let sendResult = await transporter.sendMail(message);
          if (sendResult.messageId) {
            newUser.emailNotified = true;
          }
          response.success(req, res, 'Success', 201, newUser);
        }
    } catch (error) {
      // if (error.code === 11000) {
      //   return next(boom.unauthorized('Email Already Exist'));
      // }
      next(boom.boomify(error, { statusCode: 400 }));
    }
  };

  return {
    signIn,
    signUp,
    activateAccount,
    signUpProvider,
  };
}

module.exports = authService;
