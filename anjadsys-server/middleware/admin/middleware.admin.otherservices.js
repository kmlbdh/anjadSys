
const validation = require("../middleware.validation");
const { otherServiceSchema } = require("../../schema/schema.validation.admin");

const otherServiceValidation = {
  add: validation(otherServiceSchema.add, 'body'),
  otherServiceID: validation(otherServiceSchema.otherServiceID, 'param'),
  update: validation(otherServiceSchema.update, 'body'),
  list: validation(otherServiceSchema.list, 'body'),
};

module.exports = otherServiceValidation;
