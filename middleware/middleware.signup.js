const db = require("../model");

const ROLES = db.ROLES;
const User = db.userModel;

const checkDuplicateUsernameOrNickname = async(req, res, next) => {
  try{
    let fieldName = null;
    const user = await User.findOne({$or:[{'username': req.body.username}, {'nickname': req.body.nickname}]});
    if(user){
      fieldName = user.username === req.body.username ? 'username' : 'nickname';
      return res.status(400).end({message: `${fieldName} is exist!`});
    }

    next();
  } catch(error){
    return res.status(500).end({message: error});
  }
};

const checkRoleExisted = async (req, res, next) => {
  if(!req.body.role) return;
  if(!ROLES.includes(req.body.role))
    return res.status(400).end({message: `Failed! Role ${req.body.role} does not exist!`});

  next();
};

module.exports.verifySingUp = {checkDuplicateUsernameOrNickname, checkRoleExisted};