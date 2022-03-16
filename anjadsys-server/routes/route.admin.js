const { 
  verifyLoggedIn,
  userValidation,
  serviceValidation,
  agentLimitsValidation,
  validateAddSupplier,
  carTypeValidation,
  carModelValidation,
  carValidation,
  accidentValidation,
  insurancePolicyValidation,
  accountValidation
 } = require("../middleware/middleware.admin");

const { 
  auth,
  checkDuplicateUsernameOrNickname 
} = require("../middleware/middleware.shared");

const {
  userActions,
  serviceActions,
  agentActions,
  sharedActions,
  accidentActions,
  carTypeActions,
  carModelActions,
  carActions,
  regionActions,
  insurancePolicyActions,
  accountActions
} = require("../controller/controller.admin");

module.exports = function(app){
  app.use((_req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  
/** #################### USER  ########################*/

  app.post("/api/admin/create-user",[
    auth.verifyToken,
    auth.isAdmin,
    userValidation.create,
    checkDuplicateUsernameOrNickname
  ], userActions.create);

  app.post("/api/admin/edit-user",[
    auth.verifyToken,
    auth.isAdmin,
    userValidation.update,
  ], userActions.update);

  app.post("/api/admin/delete-user",[
    auth.verifyToken,
    auth.isAdmin,
    userValidation.delete,
  ], userActions.delete);

  app.post("/api/admin/list-users",[
    auth.verifyToken,
    auth.isAdmin,
    userValidation.list,
  ], userActions.list);

  app.post("/api/admin/list-light-users",[
    auth.verifyToken,
    auth.isAdmin,
    userValidation.list,
  ], userActions.lightList);

/** #################### SUPPLIER  ########################*/
  app.post("/api/admin/create-supplier",[
    auth.verifyToken,
    auth.isAdmin,
    validateAddSupplier,
    checkDuplicateUsernameOrNickname
  ], userActions.create);

  
/** #################### SERVICE  ########################*/

  app.post("/api/admin/add-service",[
    auth.verifyToken,
    auth.isAdmin,
    serviceValidation.add,
  ], serviceActions.add);

  app.post("/api/admin/delete-service",[
    auth.verifyToken,
    auth.isAdmin,
    serviceValidation.delete,
  ], serviceActions.delete);

  app.post("/api/admin/update-service",[
    auth.verifyToken,
    auth.isAdmin,
    serviceValidation.update,
  ], serviceActions.update);

  app.post("/api/admin/list-services",[
    auth.verifyToken,
    auth.isAdmin,
    serviceValidation.list,
  ], serviceActions.list);

/** #################### AGENT LIMITS  ########################*/

  app.post("/api/admin/add-agent-limits",[
    auth.verifyToken,
    auth.isAdmin,
    agentLimitsValidation.add,
  ], agentActions.add);

  app.post("/api/admin/delete-agent-limits",[
    auth.verifyToken,
    auth.isAdmin,
    agentLimitsValidation.delete,
  ], agentActions.delete);

  app.post("/api/admin/list-agent-limits",[
    auth.verifyToken,
    auth.isAdmin,
    agentLimitsValidation.list,
  ], agentActions.list);

/** #################### REGION & ROLES API ########################*/

  app.get("/api/admin/get-regions-roles",[
    auth.verifyToken,
    auth.isAdmin,
  ], sharedActions.getRegionsAndRoles);

/** #################### REGION ########################*/

  app.get("/api/admin/list-regions",[
    auth.verifyToken,
    auth.isAdmin,
  ], regionActions.list);

/** #################### CAR TYPE ########################*/
  
  app.post("/api/admin/add-car-type",[
    auth.verifyToken,
    auth.isAdmin,
    carTypeValidation.add
  ], carTypeActions.add);

  app.post("/api/admin/edit-car-type",[
    auth.verifyToken,
    auth.isAdmin,
    carTypeValidation.update,
  ], carTypeActions.update);

  app.post("/api/admin/delete-car-type",[
    auth.verifyToken,
    auth.isAdmin,
    carTypeValidation.delete,
  ], carTypeActions.delete);

  app.post("/api/admin/list-car-types",[
    auth.verifyToken,
    auth.isAdmin,
    carTypeValidation.list,
  ], carTypeActions.list);

/** #################### CAR MODEL ########################*/

  app.post("/api/admin/add-car-model",[
    auth.verifyToken,
    auth.isAdmin,
    carModelValidation.add
  ], carModelActions.add);

  app.post("/api/admin/edit-car-model",[
    auth.verifyToken,
    auth.isAdmin,
    carModelValidation.update,
  ], carModelActions.update);

  app.post("/api/admin/delete-car-model",[
    auth.verifyToken,
    auth.isAdmin,
    carModelValidation.delete,
  ], carModelActions.delete);

  app.post("/api/admin/list-car-models",[
    auth.verifyToken,
    auth.isAdmin,
    carModelValidation.list,
  ], carModelActions.list);

  /** #################### CAR ########################*/
  app.post("/api/admin/add-car",[
    auth.verifyToken,
    auth.isAdmin,
    carValidation.add
  ], carActions.add);

  app.post("/api/admin/edit-car",[
    auth.verifyToken,
    auth.isAdmin,
    carValidation.update,
  ], carActions.update);

  app.post("/api/admin/delete-car",[
    auth.verifyToken,
    auth.isAdmin,
    carValidation.delete,
  ], carActions.delete);

  app.post("/api/admin/list-cars",[
    auth.verifyToken,
    auth.isAdmin,
    carValidation.list,
  ], carActions.list);

  /** #################### ACCIDENT ########################*/
  app.post("/api/admin/add-accident",[
    auth.verifyToken,
    auth.isAdmin,
    accidentValidation.add
  ], accidentActions.add);

  app.post("/api/admin/edit-accident",[
    auth.verifyToken,
    auth.isAdmin,
    accidentValidation.update,
  ], accidentActions.update);

  app.post("/api/admin/delete-accident",[
    auth.verifyToken,
    auth.isAdmin,
    accidentValidation.delete,
  ], accidentActions.delete);

  app.post("/api/admin/list-accidents",[
    auth.verifyToken,
    auth.isAdmin,
    accidentValidation.list,
  ], accidentActions.list); 
  
  /** #################### INSURANCE POLICY ########################*/
  app.post("/api/admin/add-insurance-policy",[
    auth.verifyToken,
    auth.isAdmin,
    insurancePolicyValidation.add
  ], insurancePolicyActions.add);

  app.post("/api/admin/edit-insurance-policy",[
    auth.verifyToken,
    auth.isAdmin,
    insurancePolicyValidation.update,
  ], insurancePolicyActions.update);

  app.post("/api/admin/delete-insurance-policy",[
    auth.verifyToken,
    auth.isAdmin,
    insurancePolicyValidation.delete,
  ], insurancePolicyActions.delete);

  app.post("/api/admin/list-insurance-policy",[
    auth.verifyToken,
    auth.isAdmin,
    insurancePolicyValidation.list,
  ], insurancePolicyActions.list);

/** #################### ACCOUNT  ########################*/

app.post("/api/admin/list-accounts",[
  auth.verifyToken,
  auth.isAdmin,
  accountValidation.list,
], accountActions.list);

};