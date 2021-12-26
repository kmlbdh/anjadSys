const validation = require("./middleware.validation");
const { schema } = require("../schema/schema.validation");

const validateListUsers = validation(schema.listUsersForAdmin, 'body');
const validateAddService = validation(schema.addServiceForAdmin, 'body');

module.exports = { validateListUsers, validateAddService };