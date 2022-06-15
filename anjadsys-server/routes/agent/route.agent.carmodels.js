const carModelRoute = require('express').Router();

const { carModelValidation } = require("../../middleware/middleware.agent");
const carModelController  = require('../../controller/agent/controller.agent.cartypes');

carModelRoute.post("/list",[
  carModelValidation.list,
], carModelController.list);

module.exports = carModelRoute;