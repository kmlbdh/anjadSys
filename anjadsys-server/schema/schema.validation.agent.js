const Joi = require("joi");

module.exports = {
  userSchema: {
    create: Joi.object().keys({
      username: Joi.string().trim().required().min(3),
      password: Joi.string().trim().required().label('password'),
      confirmPassword: Joi.any()
        .equal(Joi.ref('password'))
        .required()
        .strip() //remove it from body after validation
        .label("Confirm password")
        .options({ messages: { 'any.only': '{{#label}} doesn\'t match' } }),
      address: Joi.string().trim().optional(),
      jawwal1: Joi.number().min(9).required(),
      jawwal2: Joi.number().min(9).optional(),
      fax: Joi.number().min(7).optional(),
      tel: Joi.number().min(7).optional(),
      email: Joi.string().email().optional(),
      note: Joi.string().trim().min(10).optional(),
      regionId: Joi.number().min(1).required(),
    }),
    delete: Joi.object().keys({
      username: Joi.string().trim()
      .pattern(/^(C-\d{8})$/)
      .required()
      .options({messages: {"string.pattern.base": "username is wrong!"}})
    }),
    list: Joi.object().keys({
      limit: Joi.number().optional(),
      skip: Joi.number().optional(),
      userID: Joi.string().trim().min(10).max(10).optional(),
    }),
  },
  serviceSchema: {
    add: Joi.object().keys({
      name: Joi.string().trim().min(5).required(),
      coverageDays: Joi.number().min(1).required(),
      cost: Joi.number().min(1).required(),
      note: Joi.string().trim().optional(),
    }),
    update: Joi.object().keys({
      serviceID: Joi.string().trim().required(),
      name: Joi.string().trim().min(5).optional(),
      coverageDays: Joi.number().min(1).optional(),
      cost: Joi.number().min(1).optional(),
      note: Joi.string().trim().optional(),
    }),
    delete: Joi.object().keys({
      serviceID: Joi.string().trim().required()
    }),
    list: Joi.object().keys({
      serviceName: Joi.string().trim().min(1).optional(),
      serviceID: Joi.string().trim().min(1).optional(),
      limit: Joi.number().optional(),
      skip: Joi.number().optional()
    }),
  },
};