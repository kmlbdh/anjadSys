const accountRoute = require('express').Router();

const accountValidation = require("../../middleware/agent/middleware.agent.accounts");
const accountController  = require('../../controller/agent/controller.agent.accounts');

accountRoute.post("/list",[
  accountValidation.list,
], accountController.list);

module.exports = accountRoute;