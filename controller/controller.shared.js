const config = require("../config/config.auth");
const jwt = require("jsonwebtoken");
const db = require("../model");
const bcrypt = require("bcryptjs");
const AutoID = require("auto-id-builder");
const util = require("util");
const customError = require("../classes/customError");

//debugging NOT FOR PRODUCTION 
const createUserLog = util.debuglog("controller.shared-createUser");
const createUniqueRefIdLog = util.debuglog("controller.shared-createUniqueRefId");
const getUserLastRefIdLog = util.debuglog("controller.shared-getLastId");
const loginLog = util.debuglog("controller.shared-login");
const listUsersLog = util.debuglog("controller.shared-listUsers");
const listServicesLog = util.debuglog("controller.shared-listServices");
const listAgentLimitsLog = util.debuglog("controller.shared-listAgentLimits");

const User = db.userModel;
const Service = db.serviceModel;
const AgentLimits = db.agentLimitsModel;
// const Role = db.roleModel;
const INTERR = 'INT_ERR';

const shared = {
  createUser: async(res, data) => {
    let {username, nickname, address, password, phone, tel, note, role, agent} = data;
    
    const _id = await createUniqueRefId(role);
    createUserLog(_id);
    password = password ? bcrypt.hashSync(password): undefined;
  
    try{
      const user = new User({
        _id,
        username,
        nickname,
        password,
        address,
        phone,
        tel,
        note,
        role,
        agent
      });
      
      await user.save();
      res.json({message: "User was registered successfully!"});
    } catch(error) {
      createUserLog(error);
      let messageOfCustomError = error.code === INTERR ? error.message : "Failed! User wasn't registered!";
      res.json({message: messageOfCustomError });
    }
  },
  listUsers: async(res, query, skip, limit) => {
    try{
      const users = await User.find(query)
      .select({password: 0, __v: 0})
      .skip(skip)
      .limit(limit)
      .exec();
  
      listUsersLog(users);
      res.status(200).json({users: users});
    } catch(error){
      listUsersLog(error);
      let messageOfCustomError = error.code === INTERR ? error.message : "Failed! Can/'t get users!";
      res.status(500).json({message: messageOfCustomError});
    }
  },
  listServices: async(res, query, skip, limit) => {
    try{
      const services = await Service.find(query)
      .select({__v: 0})
      .skip(skip)
      .limit(limit)
      .exec();
  
      listServicesLog(services);
      res.status(200).json({services: services});
    } catch(error){
      listServicesLog(error);
      let messageOfCustomError = error.code === INTERR ? error.message : "Failed! Can/'t get services!";
      res.status(500).json({message: messageOfCustomError});
    }
  },
  listAgentLimits: async(res, query, skip, limit) => {
    try{
      const agentLimits = await AgentLimits.find(query)
      .select({__v: 0})
      .skip(skip)
      .limit(limit)
      .exec();
  
      listAgentLimitsLog(agentLimits);
      res.status(200).json({agentLimits: agentLimits});
    } catch(error){
      listAgentLimitsLog(error);
      let messageOfCustomError = error.code === INTERR ? error.message : "Failed! Can/'t get agent limits!";
      res.status(500).json({message: messageOfCustomError});
    }
  },
  login: async(req, res) => {
    try{
      const { username, password } = req.body;
      loginLog(username, password);

      const user = await User.findOne({_id: username}).exec();
      
      if(!user)
        throw new customError("User not found!", INTERR);
  
      loginLog(user);
  
      let validPassword = bcrypt.compareSync(password, user.password);
      if(!validPassword)
        throw new customError("wrong password!", INTERR);
  
      loginLog(validPassword);
  
      const token = jwt.sign({id: user._id}, config.secret, {expiresIn: 86400});
      loginLog(token);
      res.status(200).json({
        id: user._id,
        username: user.username,
        nickname: user.nickname,
        role: user.role,
        accessToken: token 
      });
    } catch(error){
      loginLog(error);
      let messageOfSignin = error.code === INTERR ? error.message : "Failed! can/'t sign in";
      res.status(500).json({message: messageOfSignin});
    }
  }
};

const createUniqueRefId = async (roleName) => {
  let length = 8;
  let shortPrefix = '';
  switch(roleName){
    case 'admin':
      shortPrefix = 'AD';
      length = 3;
      break;
      
    case 'agent':
      shortPrefix = 'AG';
      length = 6;
      break;

    case 'customer':
      shortPrefix = 'C';
      length = 8;
      break;

    case 'supplier':
      shortPrefix = 'SUP';
      length = 5;
      break;
  }
  const lastUserId = await getUserLastRefId(roleName);
  createUniqueRefIdLog(lastUserId?._id);
  const alphaNumericID = AutoID().newFormat()
    .addPart(true, shortPrefix, 2)
    .addPart(true, '-', 1)
    .addPart(false, 'number', length) 
    .compile();
    
  let ID = alphaNumericID.generateID(lastUserId?._id);
  createUniqueRefIdLog(ID);
  return new Promise(resolve => resolve(ID)); //TODO remove promise
};

const getUserLastRefId = async (roleName) => {
  try{
    getUserLastRefIdLog(roleName);
    const user = await User.findOne({role: roleName}, {}, {sort: {'created_at': -1}})
      .exec();
      getUserLastRefIdLog(user);
      return new Promise(resolve => resolve(user)); //TODO remove promise, wrong way, by default return promise
  } catch(error){
    getUserLastRefIdLog(error);
    let messageOfLastID = error.code === INTERR ? error.message : "Failed! no id found!";
    res.status(500).json({message: messageOfLastID});
  }
};

module.exports = shared;