const agentLimitsRoute = require("express").Router();

const { agentLimitsValidation } = require("../../middleware/middleware.admin");
const agentController = require("../../controller/admin/controller.admin.agents");

agentLimitsRoute.post("/add",[
  agentLimitsValidation.add,
], agentController.add);

agentLimitsRoute.delete("/:agentLimitID",[
  agentLimitsValidation.agentLimitID,
], agentController.delete);

agentLimitsRoute.post("/list",[
  agentLimitsValidation.list,
], agentController.list);

module.exports = agentLimitsRoute;