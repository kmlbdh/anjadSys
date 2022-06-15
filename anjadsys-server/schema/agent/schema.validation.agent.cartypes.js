const Joi = require("joi");

const carTypeSchema = {
  list: Joi.object().keys({
    name: Joi.string().trim().optional(),
    carTypeId: Joi.number().optional(),
    skip: Joi.number().optional(),
    limit: Joi.number().optional(),
  }),
};

module.exports = carTypeSchema;