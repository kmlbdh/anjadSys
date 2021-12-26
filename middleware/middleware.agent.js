const validation = require("./middleware.validation");
const { schema } = require("../schema/schema.validation");

const validateListUsers = validation(schema.listUsersForAgent, 'body');
const validateListServices = validation(schema.listServicesForAdmin, 'body');

module.exports = { validateListUsers, validateListServices };