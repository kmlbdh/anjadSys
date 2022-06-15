const validation = require("../middleware.validation");
const { carSchema } = require("../../schema/schema.validation.agent");

const carValidation = {
  add: validation(carSchema.add, 'body'),
  list: validation(carSchema.list, 'body'),
};

module.exports = carValidation;