const validation = require("../middleware.validation");
const { accountSchema } = require("../../schema/schema.validation.agent");

const accountValidation = {
  list: validation(accountSchema.list, 'body'),
};
module.exports = accountValidation;
 