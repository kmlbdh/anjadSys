const validation = require("./middleware.validation");
const { schema } = require("../schema/schema.validation");

const validateListUsers = validation(schema.listUsersForAgent, 'body');

module.exports = { validateListUsers };