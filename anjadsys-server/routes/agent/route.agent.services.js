const serviceRoute = require('express').Router();

const serviceValidation = require("../../middleware/agent/middleware.agent.services");
const serviceController  = require('../../controller/agent/controller.agent.services');

serviceRoute.post("/list",[
  serviceValidation.list,
], serviceController.list);

module.exports = serviceRoute;