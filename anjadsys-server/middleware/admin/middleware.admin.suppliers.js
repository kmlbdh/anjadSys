const validation = require("../middleware.validation");
const { supplierSchema } = require("../../schema/schema.validation.admin");

const supplierValidation = {
  create: validation(supplierSchema.create, 'body'),
  listAccount: validation(supplierSchema.list, 'body'),
};

module.exports = supplierValidation;
