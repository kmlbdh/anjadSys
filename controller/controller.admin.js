const db = require("../model");
const util = require("util");
const customError = require("../classes/customError");
const { createUser: sharedCreateUser, listUsers: sharedListUsers } = require("./controller.shared");

const User = db.userModel;
const Role = db.roleModel;
const INTERR = 'INT_ERR';

//debugging NOT FOR PRODUCTION
const listUsersLog = util.debuglog("controller.admin-ListUsers");
const createUserLog = util.debuglog("controller.admin-CreateUser");

const listUsers = async(req, res) => {
  listUsersLog(req.body.agentID);
  let query = {};
  const limit = req.body.limit ? req.body.limit : 20;
  const skip = req.body.skip ? req.body.skip : 0;
  if (req.body.role) query.role = req.body.role;
  if (req.body.agentID){
    const agId = String(req.body.agentID);
    query = {...query, 'agent.agentID': agId};
  }
  if (req.body.nickname) query = {...query, 'agent.agentNickname': req.body.nickname};
  if (req.body.userID) query._id = req.body.userID;

  listUsersLog(query);
  await sharedListUsers(res, query, skip, limit);
};

const createUser = async (req, res) => {
  try {
    let {username, nickname, password, phone, tel, note, role, agent:{agentID, agentNickname} = {}} = req.body;

    const agent = (!agentID || !agentNickname) ? undefined : {agentID, agentNickname};
    const roleDB = await Role.findOne({name: {$eq: role}}).exec();
    if(!roleDB)
      throw new customError("Failed! Role not exist!", INTERR);

    await sharedCreateUser(res, {username, nickname, password, phone, tel, note, role: roleDB.name, agent});
  } catch(error) {
    createUserLog(error);
    let messageOfCustomError = error.code === INTERR ? error.message : "Failed! User wasn't registered!";
    res.json({message: messageOfCustomError });
  }
};

const addService = async(req, res) => {
  // name: {type: String, required: true, unique: true},
  // coverDays: {type: Number, required:true},
  // cost: {type: Number, required: true},
  // note: String,
};

module.exports = {listUsers, createUser, addService};