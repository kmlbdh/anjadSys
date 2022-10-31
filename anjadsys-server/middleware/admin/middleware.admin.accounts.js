const validation = require("../middleware.validation");
const accountSchema = require("../../schema/admin/schema.validation.admin.accounts");

const accountValidation = {
  list: validation(accountSchema.list, 'body'),
};

module.exports = accountValidation;
 