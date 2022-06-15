const validation = require("../middleware.validation");
const accountSchema = require("../../schema/agent/schema.validation.agent.accounts");

const accountValidation = {
  list: validation(accountSchema.list, 'body'),
};
module.exports = accountValidation;
 