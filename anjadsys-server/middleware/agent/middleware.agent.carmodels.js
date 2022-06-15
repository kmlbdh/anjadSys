const validation = require("../middleware.validation");
const { carModelSchema } = require("../../schema/schema.validation.agent");

const carModelValidation = {
  list: validation(carModelSchema.list, 'body'),
};

module.exports = carModelValidation;