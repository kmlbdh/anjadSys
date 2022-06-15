const validation = require("../middleware.validation");
const { carModelSchema } = require("../../schema/schema.validation.admin");

const carModelValidation = {
  add: validation(carModelSchema.add, 'body'),
  update: validation(carModelSchema.update, 'body'),
  carModelId: validation(carModelSchema.carModelId, 'param'),
  list: validation(carModelSchema.list, 'body'),
};

module.exports = carModelValidation;