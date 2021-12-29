const validation = require("./middleware.validation");
const { schema } = require("../schema/schema.validation");

const validateListUsers = validation(schema.listUsersForAdmin, 'body');
const validateAddService = validation(schema.addServiceForAdmin, 'body');
const validateListServices = validation(schema.listServicesForAdmin, 'body');
const validateAddAgentLimits = validation(schema.addAgentLimitsForAdmin, 'body');
const validateListMainAgentLimits = validation(schema.listMainAgentLimitsForAdmin, 'body');
const validateAddSupplier = validation(schema.createSupplierForAdmin, 'body');
const validateAddSupplierParts = validation(schema.addSupplierPartsForAdmin, 'body');
const validateDeleteUser = validation(schema.deleteUserForAdmin, 'body');

module.exports = { 
  validateListUsers,
  validateDeleteUser,
  validateAddService,
  validateAddSupplier,
  validateAddSupplierParts,
  validateListServices,
  validateAddAgentLimits,
  validateListMainAgentLimits,
};