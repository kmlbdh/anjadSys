const otherServiceRoute = require("express").Router();

const otherServiceValidation = require('../../middleware/admin/middleware.admin.otherservices');
const otherServiceController = require("../../controller/admin/controller.admin.otherservices");

otherServiceRoute.post("/add",[
  otherServiceValidation.add,
], otherServiceController.add);

otherServiceRoute.post("/list",[
  otherServiceValidation.list,
], otherServiceController.list);

otherServiceRoute.route('/:otherServiceID')
.all(otherServiceValidation.otherServiceID)
.delete(otherServiceController.delete)
.put([
  otherServiceValidation.update,
], otherServiceController.update);

module.exports = otherServiceRoute;