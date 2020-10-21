const response = require('../response');
const boom = require('boom');

function objectIdValidationHandler(objectId){
  return (req,res,next) =>  {
    const _id = req.params[objectId];
    if(!_id.match(/^[0-9a-fA-F]{24}$/)){
        next(boom.unauthorized('Invalid Object ID'));
    }
    else{
      next();
    }
  }
}

module.exports = objectIdValidationHandler