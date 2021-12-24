const config = require("../config/config.auth");
const jwt = require("jsonwebtoken");
const db = require("../model");
const bcrypt = require("bcryptjs");
const AutoID = require("auto-id-builder");
const util = require("util");
const customError = require("../classes/customError");

//debugging NOT FOR PRODUCTION 
const authLog = util.debuglog("controller.auth.js");
const signupLog = util.debuglog("controller.auth-singup");
const signinLog = util.debuglog("controller.auth-singin");
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
    let messageOfCustomError = error.code === INTERR ? error.message : "Failed! User wasn't registered!";
    res.json({message: messageOfCustomError });
  }
};

const signin = async(req, res) => {
  try{
    const { username, password } = req.body;
    const user = await User.findOne({refId: username})
      .populate({
        path: "role",
        model: "Role",
        select: {_id:1, name:1}
      }).exec();
    
    if(!user)
      throw new customError("User not found!", INTERR);
    signinLog(user);
    let validPassword = bcrypt.compareSync(password, user.password);
    if(!validPassword)
      throw new customError("wrong password!", INTERR);
    signinLog(validPassword);
    const token = jwt.sign({refId: user.refId}, config.secret, {expiresIn: 86400});
    signinLog(token);
    res.status(200).json({
      id: user._id,
      username: user.username,
      nickname: user.nickname,
      role: user.role,
      accessToken: token 
    });
  } catch(error){
    signinLog(error);
    let messageOfSignin = error.code === INTERR ? error.message : "Failed! can/'t singIn";
    res.status(500).json({message: messageOfSignin});
  }
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
  const lastUserId = await getUserLastRefId(role._id);
  createUniqueRefIdLog(lastUserId?.refId);
  const alphaNumericID = AutoID().newFormat()
    .addPart(true, shortPrefix, 2)
    .addPart(true, '-', 1)
    .addPart(false, 'number', length) 
    .compile();
    
  let ID = alphaNumericID.generateID(lastUserId?.refId);
  createUniqueRefIdLog(ID);
  return ID;
};

const getUserLastRefId = async (roleID) => {
  try{
    const user = await User.findOne({role: roleID}, {}, {sort: {'created_at': -1}})
      .exec();
      getUserLastRefIdLog(user);
      return user;
  } catch(error){
    getUserLastRefIdLog(error);
    let messageOfLastID = error.code === INTERR ? error.message : "Failed! no id found!";
    res.status(500).json({message: messageOfLastID});
  }
};

module.exports = {signup, signin};