const validation = require("../middleware.validation");
const { carTypeSchema } = require("../../schema/schema.validation.agent");

const carTypeValidation = {
  list: validation(carTypeSchema.list, 'body'),
 };

module.exports = carTypeValidation;