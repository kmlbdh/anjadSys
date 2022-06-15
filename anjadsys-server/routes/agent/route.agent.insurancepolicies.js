const insurancePolicyRoute = require('express').Router();

const { insurancePolicyValidation } = require("../../middleware/middleware.agent");
const insurancePolicyController  = require('../../controller/agent/controller.agent.insurancepolicies');

insurancePolicyRoute.post("/add",[
  insurancePolicyValidation.add
], insurancePolicyController.add);

insurancePolicyRoute.post("/list",[
  insurancePolicyValidation.list,
], insurancePolicyController.list);

module.exports = insurancePolicyRoute;