const validation = require("./middleware.validation");
const { 
  userSchema,
  serviceSchema,
  otherServiceSchema,
  agentLimitsSchema,
  carSchema,
  carTypeSchema,
  carModelSchema,
  accidentSchema,
  insurancePolicySchema,
  accountSchema,
  supplierSchema
} = require("../schema/schema.validation.admin");

const userValidation = {
  create: validation(userSchema.create, 'body'),
  userID: validation(userSchema.userID, 'param'),
  update: validation(userSchema.update, 'body'),
  list: validation(userSchema.list, 'body'),
  // delete: validation(userSchema.delete, 'body'),
};

const supplierValidation = {
  create: validation(supplierSchema.create, 'body'),
  listAccount: validation(supplierSchema.list, 'body'),
}

const serviceValidation = {
   add: validation(serviceSchema.add, 'body'),
   serviceID: validation(serviceSchema.serviceID, 'param'),
  //  delete: validation(serviceSchema.delete, 'body'),
   update: validation(serviceSchema.update, 'body'),
   list: validation(serviceSchema.list, 'body'),
};

const otherServiceValidation = {
   add: validation(otherServiceSchema.add, 'body'),
   otherServiceID: validation(otherServiceSchema.otherServiceID, 'param'),
  //  delete: validation(otherServiceSchema.delete, 'body'),
   update: validation(otherServiceSchema.update, 'body'),
   list: validation(otherServiceSchema.list, 'body'),
};

const agentLimitsValidation = {
 add: validation(agentLimitsSchema.add, 'body'),
 agentLimitID: validation(agentLimitsSchema.agentLimitID, 'param'),
//  delete: validation(agentLimitsSchema.delete, 'body'),
 list: validation(agentLimitsSchema.list, 'body'),
};

const carTypeValidation = {
 add: validation(carTypeSchema.add, 'body'),
 update: validation(carTypeSchema.update, 'body'),
 carTypeId: validation(carTypeSchema.carTypeId, 'param'),
//  delete: validation(carTypeSchema.delete, 'body'),
 list: validation(carTypeSchema.list, 'body'),
};

const carModelValidation = {
 add: validation(carModelSchema.add, 'body'),
 update: validation(carModelSchema.update, 'body'),
 carModelId: validation(carModelSchema.carModelId, 'param'),
//  delete: validation(carModelSchema.delete, 'body'),
 list: validation(carModelSchema.list, 'body'),
};

const carValidation = {
 add: validation(carSchema.add, 'body'),
 update: validation(carSchema.update, 'body'),
 carId: validation(carSchema.carId, 'param'),
//  delete: validation(carSchema.delete, 'body'),
 list: validation(carSchema.list, 'body'),
};

const accidentValidation = {
 add: validation(accidentSchema.add, 'body'),
 update: validation(accidentSchema.update, 'body'),
 accidentId: validation(accidentSchema.accidentId, 'param'),
//  delete: validation(accidentSchema.delete, 'body'),
 list: validation(accidentSchema.list, 'body'),
};

const accountValidation = {
 list: validation(accountSchema.list, 'body'),
};

const insurancePolicyValidation = {
 add: validation(insurancePolicySchema.add, 'body'),
 update: validation(insurancePolicySchema.update, 'body'),
 insurancePolicyId: validation(insurancePolicySchema.insurancePolicyId, 'param'),
//  delete: validation(insurancePolicySchema.delete, 'body'),
 list: validation(insurancePolicySchema.list, 'body'),
};



module.exports = { 
  userValidation,
  serviceValidation,
  otherServiceValidation,
  agentLimitsValidation,
  carTypeValidation,
  carModelValidation,
  carValidation,
  accidentValidation,
  insurancePolicyValidation,
  accountValidation,
  supplierValidation,
};