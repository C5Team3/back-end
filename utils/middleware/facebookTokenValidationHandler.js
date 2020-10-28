const boom = require('boom');
const axios = require('axios');
const config = require('../../config/index');

function facebookTokenValidationHandler () {
  return async (req, res, next) => {
    const { accessToken } = req.body;
    try{
      // Get App Token with App Id and Secret Password
      const {data} = await axios.get(`https://graph.facebook.com/oauth/access_token?client_id=${config.facebook_app_id}&client_secret=${config.facebook_app_secret}&grant_type=client_credentials`);
      
      const accessAppToken = data.access_token;     
    
      if(!accessAppToken){
        boom.unauthorized('it was not impossible to validate facebook token');
      }
      
      const bearer = {
        headers: { Authorization: `Bearer ${accessAppToken}`}
      };
      // Verify Facebook Token Authenticity
      const tokenVerifyProcess = await axios.get(
      `https://graph.facebook.com/v8.0/debug_token?input_token=${accessToken}`,
        bearer,
      );
      // Facebook Token Response Validation
      if(!tokenVerifyProcess.data.is_valid){
        boom.unauthorized('Your Facebook Token is Invalid');
      }
      // Call to getOrUpdate Users
      delete req.body.accessToken;
      next();
    }catch(error){
      boom.boomify(error, {statusCode:500});
    }
  };
}
module.exports = facebookTokenValidationHandler;

