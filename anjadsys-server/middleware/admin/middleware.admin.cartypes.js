const validation = require("../middleware.validation");
const { carTypeSchema } = require("../../schema/schema.validation.admin");

const carTypeValidation = {
  add: validation(carTypeSchema.add, 'body'),
  update: validation(carTypeSchema.update, 'body'),
  carTypeId: validation(carTypeSchema.carTypeId, 'param'),
  list: validation(carTypeSchema.list, 'body'),
};

module.exports = carTypeValidation;