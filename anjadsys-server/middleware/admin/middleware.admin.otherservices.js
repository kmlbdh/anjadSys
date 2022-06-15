
const validation = require("../middleware.validation");
const otherServiceSchema = require("../../schema/admin/schema.validation.admin.otherservices");

const otherServiceValidation = {
  add: validation(otherServiceSchema.add, 'body'),
  otherServiceID: validation(otherServiceSchema.otherServiceID, 'param'),
  update: validation(otherServiceSchema.update, 'body'),
  list: validation(otherServiceSchema.list, 'body'),
};

module.exports = otherServiceValidation;
