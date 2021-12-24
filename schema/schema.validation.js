const Joi = require("joi");

module.exports.schema = {
  signup: Joi.object().keys({
    username: Joi.string().required().min(3),
    nickname: Joi.string().min(3).optional(),
    password: Joi.string().required().label('password'),
    confirmPassword: Joi.any()
      .equal(Joi.ref('password'))
      .required()
      .strip() //remove it from body after validation
      .label("Confirm password")
      .options({ messages: { 'any.only': '{{#label}} doesn\'t match' } }),
    phone: Joi.number().required().min(9),
    tel: Joi.number().min(7).optional(),
    note: Joi.string().min(10).optional(),
    role: Joi.string().required().min(5),
  }),
  singin: Joi.object().keys({
    username: Joi.string()
      .pattern(/^(AD-\d{3})$|^(AG-\d{6})$|^(C-\d{8})$/)
      .required()
      .options({messages: {"string.pattern.base": "username is wrong!"}}),
    password: Joi.string().required()
  }),
};