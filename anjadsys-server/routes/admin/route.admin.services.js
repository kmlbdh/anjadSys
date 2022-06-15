const serviceRoute = require("express").Router();

const { serviceValidation } = require("../../middleware/middleware.admin");
const serviceController = require("../../controller/admin/controller.admin.services");

serviceRoute.post("/add",[
  serviceValidation.add,
], serviceController.add);

serviceRoute.post("/list",[
  serviceValidation.list,
], serviceController.list);

serviceRoute.route("/:serviceID")
  .all(serviceValidation.serviceID)
  .delete(serviceController.delete)
  .put([
    serviceValidation.update,
  ], serviceController.update);

module.exports = serviceRoute;