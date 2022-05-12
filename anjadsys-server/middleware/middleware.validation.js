const Joi = require("joi");
const util = require('util');

const log = util.debuglog("middleware.validation");

const validation = (schema, property) => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property]);

    const valid = error == null;

    if(valid){
      next();
    } else {
      const { details } = error;
      const message = details.map(i => i.message).join(',');

      log(message);
      res.status(422).json({message: message});
    }
  }
};

module.exports = validation;