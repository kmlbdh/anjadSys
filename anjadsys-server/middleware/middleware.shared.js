const jwt = require("jsonwebtoken");
const config = require("../config/config.auth");
const db = require("../models");
const util = require("util");
const customError = require("../classes/customError");
const errorHandler = require("../classes/errorhandler");
const validation = require("./middleware.validation");
const { login } = require("../schema/schema.validation.shared");
const { Op } = require("sequelize");

const User = db.User;
const Role = db.Role;

const INTERR = "INT_ERR";

//debugging NOT FOR PRODUCTION
const verifyTokenLog = util.debuglog("middleware.auth-VerifyToken");
const isAdminLog = util.debuglog("middleware.auth-isAdmin");
const checkRoleLog = util.debuglog("middleware.checkRole");
const checkDuplicateLog = util.debuglog("middleware.auth-checkDuplicateUsernameOrNickname");

const auth = {
  isAdmin: async (req, res, next) => {
    let errorCode;
    try{
      const done = await checkRole('admin', req, res);
      if(done) next();
      else{
        errorCode = 401;
        throw new customError("Unauthorized!", INTERR);
      } 
    } catch(error){
      console.log(error);
      errorHandler(res, error, "Failed! can't get admin privilege!", errorCode);
    }
  },
  isAgent: async (req, res, next) => {
    let errorCode;
    try{
      const done = await checkRole('agent', req, res);
      if(done) next();
      else{
        errorCode = 401;
        throw new customError("Unauthorized!", INTERR);
      } 
    } catch(error){
      console.log(error);
      errorHandler(res, error, "Failed! can't get agent privilege!", errorCode);
    }
  },
  isCustomer: async (req, res, next) => {
    let errorCode;
    try{
      const done = await checkRole('customer', req, res);;
      if(done) next();
      else{
        errorCode = 401;
        throw new customError("Unauthorized!", INTERR);
      }
    } catch(error){
      console.log(error);
      errorHandler(res, error, "Failed! can't get customer privilege!", errorCode);
    }
  },
  verifyToken: (req, res, next) => {
    let errorCode;
    try{
      let token = req.headers['x-access-token'];
      verifyTokenLog(token);
  
      if(!token){
        errorCode = 401;
        throw new customError("No token provided!", INTERR);
      }
      
      jwt.verify(token, config.secret, (error, decoded) => {
      if(error){
        errorCode = 401;
        throw new customError("Unauthorized!", INTERR);
      }
    
          req.id = decoded.id;
          next();
      });
    } catch(error){
      verifyTokenLog(error);
      errorHandler(res, error, "Failed! can't get token!", errorCode);
    }
  }
};

const checkDuplicateUsernameOrNickname = async(req, res, next) => {
  try{
    const query = {where: {[Op.or]: []}};
    if(req.body.username) query.where[Op.or].push({username: req.body.username});
    if(req.body.companyName) query.where[Op.or].push({companyName: req.body.companyName});
    
    checkDuplicateLog(query);

    let fieldName = null;
    const user = await User.findOne(query);

    checkDuplicateLog(user);

    if(user){
      fieldName = user.username === req.body.username ? 'username' : 'companyName';
      return res.status(400).json({message: `${fieldName} is exist!`});
    }

    next();
  } catch(error){
    errorHandler(res, error, "Failed! can't verify user existance", 400);
  }
};

const verifyLogin =  validation(login, 'body');

const checkRole = async(roleName, req, res) => {
  try{
    // checkRoleLog(roleName);
    // checkRoleLog(req.id);

    const user = await User.findOne({
      where: { id: req.id },
      include: [{
        model: Role,
        required: true,
        where: { name: {
          [Op.substring]: roleName
        }}
      }]
    });

    // checkRoleLog(user);

    if(!user || !user.Role || user.Role.name !== roleName)
      throw new customError(`Require ${roleName} Role!`, INTERR);
    
    const { id, username, companyName, Role: {name: role} } = user;
 
    if(roleName === 'admin'){
      req.admin = { id, username, companyName, role};
    }
    else if(roleName === 'agent'){
      req.agent = { id, username, companyName, role};
    }
    // checkRoleLog(req.admin, req.agent);

    return (req.admin || req.agent);//TODO wrong behaviour, fail on customer check 
  } catch(error){
    checkRoleLog(error);
    errorHandler(res, error, "Failed! can't get role!");
  }
};

module.exports = { auth, verifyLogin, checkDuplicateUsernameOrNickname };