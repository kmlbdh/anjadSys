const validation = require("../middleware.validation");
const { accountSchema } = require("../../schema/schema.validation.admin");

const accountValidation = {
  list: validation(accountSchema.list, 'body'),
};

module.exports = accountValidation;
 