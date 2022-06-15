const validation = require("../middleware.validation");
const carSchema = require("../../schema/admin/schema.validation.admin.cars");

const carValidation = {
  add: validation(carSchema.add, 'body'),
  update: validation(carSchema.update, 'body'),
  carId: validation(carSchema.carId, 'param'),
  list: validation(carSchema.list, 'body'),
};

module.exports = carValidation;