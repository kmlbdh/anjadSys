const { 
  validateListUsers,
  validateDeleteUser,
  validateAddService,
  validateDeleteService,
  validateListServices,
  validateAddAgentLimits,
  validateDeleteAgentLimits,
  validateListMainAgentLimits,
  validateAddSupplier,
  validateAddSupplierParts,
  validateDeleteSupplierPart,
 } = require("../middleware/middleware.admin");
const { auth, verifyCreateUser } = require("../middleware/middleware.shared");
const controller = require("../controller/controller.admin");

module.exports = function(app){
  app.use((_req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post("/api/admin/create-user",[
    auth.verifyToken,
    auth.isAdmin,
    verifyCreateUser.validateCreateUser,
    verifyCreateUser.checkDuplicateUsernameOrNickname
  ], controller.createUser);

  app.post("/api/admin/delete-user",[
    auth.verifyToken,
    auth.isAdmin,
    validateDeleteUser,
  ], controller.deleteUser);

  app.post("/api/admin/create-supplier",[
    auth.verifyToken,
    auth.isAdmin,
    validateAddSupplier,
    verifyCreateUser.checkDuplicateUsernameOrNickname
  ], controller.createSupplier);

  app.post("/api/admin/add-supplier-part",[
    auth.verifyToken,
    auth.isAdmin,
    validateAddSupplierParts,
  ], controller.addSupplierParts);

  app.post("/api/admin/delete-supplier-part",[
    auth.verifyToken,
    auth.isAdmin,
    validateDeleteSupplierPart,
  ], controller.deleteSupplierParts);

  app.post("/api/admin/list-users",[
    auth.verifyToken,
    auth.isAdmin,
    validateListUsers
  ], controller.listUsers);

  app.post("/api/admin/add-service",[
    auth.verifyToken,
    auth.isAdmin,
    validateAddService,
  ], controller.addService);

  app.post("/api/admin/delete-service",[
    auth.verifyToken,
    auth.isAdmin,
    validateDeleteService,
  ], controller.deleteService);

  app.post("/api/admin/list-services",[
    auth.verifyToken,
    auth.isAdmin,
    validateListServices,
  ], controller.listServices);

  app.post("/api/admin/add-agent-limits",[
    auth.verifyToken,
    auth.isAdmin,
    validateAddAgentLimits,
  ], controller.addAgentLimits);

  app.post("/api/admin/delete-agent-limits",[
    auth.verifyToken,
    auth.isAdmin,
    validateDeleteAgentLimits,
  ], controller.deleteAgentLimits);

  app.post("/api/admin/list-main-agent-limits",[
    auth.verifyToken,
    auth.isAdmin,
    validateListMainAgentLimits,
  ], controller.listMainAgentLimits);
};