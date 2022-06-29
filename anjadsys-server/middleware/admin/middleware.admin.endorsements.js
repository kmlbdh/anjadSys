const validation = require("../middleware.validation");
const endorsementSchema = require("../../schema/admin/schema.validation.admin.endorsements");

const endorsementValidation = {
  add: validation(endorsementSchema.add, 'body'),
  update: validation(endorsementSchema.update, 'body'),
  endorsementId: validation(endorsementSchema.endorsementId, 'param'),
  list: validation(endorsementSchema.list, 'body'),
};

module.exports = endorsementValidation;