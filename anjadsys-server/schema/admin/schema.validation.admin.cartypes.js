const Joi = require("joi");

const carTypeSchema = {
  add: Joi.object().keys({
    name: Joi.string().trim().required(),
  }),
  update: Joi.object().keys({
    name: Joi.string().trim().required(),
  }),
  carTypeId: Joi.any().required(),
  list: Joi.object().keys({
    name: Joi.string().trim().optional(),
    carTypeId: Joi.number().optional(),
    skip: Joi.number().optional(),
    limit: Joi.number().optional(),
  }),
};

module.exports = carTypeSchema;