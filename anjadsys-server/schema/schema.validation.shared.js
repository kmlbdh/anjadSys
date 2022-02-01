const Joi = require("joi");

module.exports = {
  login: Joi.object().keys({
    username: Joi.string().trim()
      .pattern(/^(AD-\d{3})$|^(AG-\d{6})$|^(C-\d{8})$/)
      .required()
      .options({messages: {"string.pattern.base": "username is wrong!"}}),
    password: Joi.string().trim().required()
  }),
};