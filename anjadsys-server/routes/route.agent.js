const { 
  verifyLoggedIn,
  userValidation,
  serviceValidation,
  carTypeValidation,
  carModelValidation,
  carValidation,
  accidentValidation,
  insurancePolicyValidation,
  accountValidation,
  notBlockedUser,
 } = require("../middleware/middleware.agent");

const { 
  auth,
  checkDuplicateUsernameOrNickname 
} = require("../middleware/middleware.shared");

const {
  userActions,
  serviceActions,
  accidentActions,
  carTypeActions,
  carModelActions,
  carActions,
  regionActions,
  insurancePolicyActions,
  accountActions,
} = require("../controller/controller.agent");

module.exports = function(app){
  app.use((_req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

/** #################### USER  ########################*/

  app.post("/api/agent/create-user",[
    auth.verifyToken,
    auth.isAgent,
    userValidation.create,
    checkDuplicateUsernameOrNickname
  ], userActions.create);

  app.post("/api/agent/list-users",[
    auth.verifyToken,
    auth.isAgent,
    userValidation.list,
  ], userActions.list);

  app.post("/api/agent/list-not-block-users",[
    auth.verifyToken,
    auth.isAgent,
    userValidation.list,
    notBlockedUser
  ], userActions.list);

  app.post("/api/agent/list-light-users",[
    auth.verifyToken,
    auth.isAgent,
    userValidation.list,
  ], userActions.lightList);

  app.post("/api/agent/list-suppliers",[
    auth.verifyToken,
    auth.isAgent,
    userValidation.listSuppliers,
  ], userActions.listSuppliers);

    
/** #################### SERVICE  ########################*/

  app.post("/api/agent/list-services",[
    auth.verifyToken,
    auth.isAgent,
    serviceValidation.list,
  ], serviceActions.list);

/** #################### REGION ########################*/

  app.get("/api/agent/list-regions",[
    auth.verifyToken,
    auth.isAgent,
  ], regionActions.list);

/** #################### CAR TYPE ########################*/

  app.post("/api/agent/list-car-types",[
    auth.verifyToken,
    auth.isAgent,
    carTypeValidation.list,
  ], carTypeActions.list);

/** #################### CAR MODEL ########################*/

  app.post("/api/agent/list-car-models",[
    auth.verifyToken,
    auth.isAgent,
    carModelValidation.list,
  ], carModelActions.list);

   /** #################### CAR ########################*/
   app.post("/api/agent/add-car",[
    auth.verifyToken,
    auth.isAgent,
    carValidation.add
  ], carActions.add);

  app.post("/api/agent/list-cars",[
    auth.verifyToken,
    auth.isAgent,
    carValidation.list,
  ], carActions.list);

  /** #################### ACCIDENT ########################*/
  app.post("/api/agent/add-accident",[
    auth.verifyToken,
    auth.isAgent,
    accidentValidation.add
  ], accidentActions.add);

  app.post("/api/agent/list-accidents",[
    auth.verifyToken,
    auth.isAgent,
    accidentValidation.list,
  ], accidentActions.list); 

/** #################### INSURANCE POLICY ########################*/
  app.post("/api/agent/add-insurance-policy",[
    auth.verifyToken,
    auth.isAgent,
    insurancePolicyValidation.add
  ], insurancePolicyActions.add);

  app.post("/api/agent/list-insurance-policy",[
    auth.verifyToken,
    auth.isAgent,
    insurancePolicyValidation.list,
  ], insurancePolicyActions.list);

/** #################### ACCOUNT  ########################*/

  app.post("/api/agent/list-accounts",[
    auth.verifyToken,
    auth.isAgent,
    accountValidation.list,
  ], accountActions.list);
};