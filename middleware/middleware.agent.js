const validation = require("./middleware.validation");
const { schema } = require("../schema/schema.validation");

const validateListUsers = validation(schema.listUsersForAgent, 'body');
const validateListServices = validation(schema.listServicesForAdmin, 'body');
const validateAddServiceToCustomer = validation(schema.addServiceToCustomerOfAgent, 'body');

module.exports = { 
  validateListUsers, 
  validateListServices,
  validateAddServiceToCustomer
};