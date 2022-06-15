const carModelRoute = require('express').Router();

const carModelValidation = require("../../middleware/agent/middleware.agent.carmodels");
const carModelController  = require('../../controller/agent/controller.agent.cartypes');

carModelRoute.post("/list",[
  carModelValidation.list,
], carModelController.list);

module.exports = carModelRoute;