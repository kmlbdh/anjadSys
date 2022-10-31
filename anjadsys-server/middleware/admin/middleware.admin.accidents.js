const validation = require("../middleware.validation");
const accidentSchema = require("../../schema/admin/schema.validation.admin.accidents");

const accidentValidation = {
  add: validation(accidentSchema.add, 'body'),
  update: validation(accidentSchema.update, 'body'),
  accidentId: validation(accidentSchema.accidentId, 'param'),
  list: validation(accidentSchema.list, 'body'),
};

module.exports = accidentValidation;
 