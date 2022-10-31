const insurancePolicyRoute = require("express").Router();

const insurancePolicyValidation = require('../../middleware/admin/middleware.admin.insurancepolicies');
const insurancePolicyController = require("../../controller/admin/controller.admin.insurancepolicies");

insurancePolicyRoute.post("/add",[
  insurancePolicyValidation.add
], insurancePolicyController.add);

insurancePolicyRoute.route('/:insurancePolicyId')
.all(insurancePolicyValidation.insurancePolicyId)
.delete(insurancePolicyController.delete)
.put([
  insurancePolicyValidation.update,
], insurancePolicyController.update);

insurancePolicyRoute.post("/list",[
  insurancePolicyValidation.list,
], insurancePolicyController.list);

module.exports = insurancePolicyRoute;