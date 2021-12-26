const db = require("../model");
const util = require("util");
const customError = require("../classes/customError");
const { createUser: sharedCreateUser, listUsers: sharedListUsers } = require("./controller.shared");

const User = db.userModel;
const Role = db.roleModel;
const INTERR = 'INT_ERR';

//debugging NOT FOR PRODUCTION
const listUsersLog = util.debuglog("controller.agent-ListUsers");
const createUserLog = util.debuglog("controller.agent-CreateUser");

const listUsers = async(req, res) => {
  const role = await Role.findOne({name: 'customer'}).exec();
  const limit = req.body.limit ? req.body.limit : 20;
  const skip = req.body.skip ? req.body.skip : 0;

  if(!req.agent || !role)
    throw new customError("Unauthorized!", INTERR);

  const query = {'role': role.name, 'agent.agentID': req.agent._id};
  // if (req.agent.nickname) query = {...query,  'agent.agentNickname': req.agent.nickname};
  if (req.body.userID) query._id = req.body.userID;

  listUsersLog(role);
  await sharedListUsers(res, query, skip, limit);
};

const createUser = async (req, res) => {
  try {
    let {username, nickname, password, phone, tel, note} = req.body;
    const agent = {
      agentId: req.agent.agentID,
      agentNickname: req.agent.agentNickname
    };
    const roleDB = await Role.findOne({name: {$eq: 'customer'}}).exec();

    await sharedCreateUser(res, {username, nickname, password, phone, tel, note, role: roleDB.name, agent});
  } catch(error) {
    createUserLog(error);
    let messageOfCustomError = error.code === INTERR ? error.message : "Failed! User wasn't registered!";
    res.json({message: messageOfCustomError });
  }
};

//TODO same function in admin, if haven't more requirements in both need to move to shared controller
const listServices = async(req, res) => {
  try{
    listServicesLog(req.body.agentID);
    let query = {};
    const limit = req.body.limit ? req.body.limit : 20;
    const skip = req.body.skip ? req.body.skip : 0;
    if (req.body.serviceName) query.name = req.body.serviceName;

    listServicesLog(query);
    await sharedlistServices(res, query, skip, limit);

  } catch(error) {
    listServicesLog(error);
    let messageOfCustomError = error.code === INTERR ? error.message : "Failed! can't get services!";
    res.json({message: messageOfCustomError });
  }
};

module.exports = {listUsers, createUser, listServices};