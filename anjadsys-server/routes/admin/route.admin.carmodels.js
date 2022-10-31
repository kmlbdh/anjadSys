const carModelRoute = require("express").Router();

const carModelValidation = require('../../middleware/admin/middleware.admin.carmodels');
const carModelController = require("../../controller/admin/controller.admin.carmodels");

carModelRoute.post("/add",[
  carModelValidation.add
], carModelController.add);

carModelRoute.route("/:carModelId")
.all(carModelValidation.carModelId)
.delete(carModelController.delete)
.put([
  carModelValidation.update,
], carModelController.update);

carModelRoute.post("/list",[
  carModelValidation.list,
], carModelController.list);

module.exports = carModelRoute;