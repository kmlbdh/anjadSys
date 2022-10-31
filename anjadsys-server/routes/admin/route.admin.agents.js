const agentLimitsRoute = require("express").Router();

const agentValidation = require('../../middleware/admin/middleware.admin.agents');
const agentController = require("../../controller/admin/controller.admin.agents");

agentLimitsRoute.post("/add",[
  agentValidation.add,
], agentController.add);

agentLimitsRoute.delete("/:agentLimitID",[
  agentValidation.agentLimitID,
], agentController.delete);

agentLimitsRoute.post("/list",[
  agentValidation.list,
], agentController.list);

module.exports = agentLimitsRoute;