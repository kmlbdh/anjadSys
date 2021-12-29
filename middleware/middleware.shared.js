const jwt = require("jsonwebtoken");
const config = require("../config/config.auth");
const db = require("../model");
const util = require("util");
const customError = require("../classes/customError");
const errorHandler = require("../classes/errorhandler");
const validation = require("./middleware.validation");
const { schema } = require("../schema/schema.validation");

const User = db.userModel;
// const Role = db.roleModel;
const StaticRoles = db.ROLES;
const INTERR = "INT_ERR";

//debugging NOT FOR PRODUCTION
const verifyTokenLog = util.debuglog("middleware.auth-VerifyToken");
const isAdminLog = util.debuglog("middleware.auth-isAdmin");
const checkDuplicateLog = util.debuglog("middleware.auth-checkDuplicateUsernameOrNickname");

const auth = {
  isAdmin: async (req, res, next) => {
    try{
      const done = await checkRole(2, req, res);
      if(done) next();
      else throw new customError("Unauthorized!", INTERR);
    } catch(error){
      console.log(error);
      errorHandler(res, error, "Failed! can't get admin privilege!");
    }
  },
  isAgent: async (req, res, next) => {
    try{
      const done = await checkRole(1, req, res);
      if(done) next();
      else throw new customError("Unauthorized!", INTERR);
    } catch(error){
      console.log(error);
      errorHandler(res, error, "Failed! can't get agent privilege!");
    }
  },
  isCustomer: async (req, res, next) => {
    try{
      const done = await checkRole(0, req, res);;
      if(done) next();
      else throw new customError("Unauthorized!", INTERR);
    } catch(error){
      console.log(error);
      errorHandler(res, error, "Failed! can't get customer privilege!");
    }
  },
  verifyToken: (req, res, next) => {
    try{
      let token = req.headers['x-access-token'];
      verifyTokenLog(token);
  
      if(!token)
        throw new customError("No token provided!", INTERR);
      
      jwt.verify(token, config.secret, (error, decoded) => {
        if(error)
          throw new customError("Unauthorized!", INTERR);
    
          req.id = decoded.id;
          next();
      });
    } catch(error){
      verifyTokenLog(error);
      errorHandler(res, error, "Failed! can't get token!");
    }
  }
};

const verifyCreateUser = {
  checkDuplicateUsernameOrNickname: async(req, res, next) => {
    try{
      const OR = [];
      if(req.body.username) OR.push({'username': req.body.username});
      if(req.body.nickname) OR.push({'nickname': req.body.nickname});
      let fieldName = null;
      const user = await User.findOne({$or:OR});
      checkDuplicateLog(user);
      if(user){
        fieldName = user.username === req.body.username ? 'username' : 'nickname';
        return res.status(400).json({message: `${fieldName} is exist!`});
      }
  
      next();
    } catch(error){
      errorHandler(res, error, "Failed! can't verify user existance", 400);
    }
  },
  validateCreateUser: validation(schema.createUser, 'body')
};


const verifyLogin = {
  validateLogin: validation(schema.login, 'body')
};

const checkRole = async(roleIndex, req, res) => {
  const roleString = StaticRoles[roleIndex];
  isAdminLog(roleIndex);
  try{
    isAdminLog(roleString);
    isAdminLog(req.id);

    const user = await User.findOne({_id:req.id}).exec();

    isAdminLog(user);

    if(!user || !user.role || user.role !== roleString)
      throw new customError(`Require ${roleString} Role!`, INTERR);
    
    const {_id, username, nickname, role} = user;
 
    if(roleIndex === 2){
      req.admin = {_id, username, nickname, role};
    }
    else if(roleIndex === 1){
      req.agent = {_id, username, nickname, role};
    }
    isAdminLog(req.admin, req.agent);

    return (req.admin || req.agent);//TODO wrong behaviour, fail on customer check 
  } catch(error){
    isAdminLog(error);
    errorHandler(res, error, "Failed! can't get role!");
  }
};

module.exports = {auth, verifyLogin, verifyCreateUser};