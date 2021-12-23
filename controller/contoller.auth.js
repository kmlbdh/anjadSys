const config = require("../config/config.auth");
const jwt = require("jsonwebtoken");
const db = require("../model");
const bcrypt = require("bcryptjs");
const AutoID = require("auto-id-builder");
const util = require("util");
const customErorr = require("../classes/customError");

//debugging NOT FOR PRODUCTION 
const authLog = util.debuglog("controller.auth.js");
const signupLog = util.debuglog("controller.auth-singup");
const createUniqueRefIdLog = util.debuglog("controller.auth-createUniqueRefId");
const getUserLastRefIdLog = util.debuglog("controller.auth-getLastId");

const User = db.userModel;
const Role = db.roleModel;
const INTERR = 'INT_ERR';

const signup = async (req, res) => {
  try {
    let {username, nickname, password, phone, tel, note = null, role} = req.body;
    
    const roleDB = await Role.findOne({name: {$eq: role}}).exec();

    if(!roleDB)
      throw new customError("Failed! Role not exist!", INTERR);
    
    const refId = await createUniqueRefId(roleDB);
    role = roleDB._id;
    password = bcrypt.hashSync(password);

    const user = new User({
      refId,
      username,
      nickname,
      password,
      phone,
      tel,
      note,
      role
    });
    
    const saved = await user.save();
    res.json({message: "User was registered successfully!"});
  } catch(error) {
    signupLog(error);
    let messageOfCustomError = error.code === 'INT_ERR' ? error.message : "Failed! User wasn't registered!";
    res.json({message: messageOfCustomError });
  }
};

const singin = () => {

};

const createUniqueRefId = async (role) => {
  let length = 8;
  let shortPrefix = '';
  switch(role.name){
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
  }
  const lastUserId = await getUserLastRefId(role._id)?.refId;
  createUniqueRefIdLog(lastUserId);
  const alphaNumericID = AutoID().newFormat()
    .addPart(true, shortPrefix, 2)
    .addPart(true, '-', 1)
    .addPart(false, 'number', length) 
    .compile();
    
  let ID = alphaNumericID.generateID(lastUserId);
  createUniqueRefIdLog(ID);
  return ID;
};

const getUserLastRefId = async (roleID) => {
  try{
    const user = await User.findOne({role: db.mongoose.Types.ObjectId(roleID)}, {}, {sort: {'created_at': -1}})
      .exec();
      getUserLastRefIdLog(user);
      return user;
  } catch(error){
    getUserLastRefIdLog(error);
    let messageOfLastID = error.code === 'INT_ERR' ? error.message : "Failed! no id found!";
    res.status(500).json({message: messageOfLastID});
  }
};

module.exports = {signup, singin};