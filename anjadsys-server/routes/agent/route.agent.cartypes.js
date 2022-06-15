const carTypeRoute = require('express').Router();

const { carTypeValidation } = require("../../middleware/middleware.agent");
const carTypeController  = require('../../controller/agent/controller.agent.cartypes');

carTypeRoute.post("/list",[
  carTypeValidation.list,
], carTypeController.list);

module.exports = carTypeRoute;