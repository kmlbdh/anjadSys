const validation = require("./middleware.validation");
const { schema } = require("../schema/schema.validation");

const validateUpdateUser = validation(schema.updateUser, 'body');
const validateListUsers = validation(schema.listUsersForAdmin, 'body');
const validateAddService = validation(schema.addServiceForAdmin, 'body');
const validateDeleteService = validation(schema.deleteServiceForAdmin, 'body');
const validateUpdateService = validation(schema.updateServiceForAdmin, 'body');
const validateListServices = validation(schema.listServicesForAdmin, 'body');
const validateAddAgentLimits = validation(schema.addAgentLimitsForAdmin, 'body');
const validateDeleteAgentLimits = validation(schema.deleteAgentLimitsForAdmin, 'body');
const validateListAgentLimits = validation(schema.listAgentLimitsForAdmin, 'body');
const validateAddSupplier = validation(schema.createSupplierForAdmin, 'body');
const validateAddSupplierParts = validation(schema.addSupplierPartsForAdmin, 'body');
const validateDeleteSupplierPart = validation(schema.deleteSupplierPartsForAdmin, 'body');
const validateListSupplierPart = validation(schema.listSupplierPartsForAdmin, 'body');
const validateDeleteUser = validation(schema.deleteUserForAdmin, 'body');

module.exports = { 
  validateListUsers,
  validateDeleteUser,
  validateUpdateUser,
  validateAddService,
  validateDeleteService,
  validateUpdateService,
  validateAddSupplier,
  validateAddSupplierParts,
  validateDeleteSupplierPart,
  validateListSupplierPart,
  validateListServices,
  validateAddAgentLimits,
  validateDeleteAgentLimits,
  validateListAgentLimits,
};