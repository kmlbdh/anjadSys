const jwt = require("jsonwebtoken");
const config = require("../config/config.auth");
const db = require("../model");

const User = db.userModel;
const Role = db.roleModel;
const StaticRoles = db.ROLES;

const verifyToken = (req, res, next) => {
  let token = req.headers['x-access-token'];

  if(!token)
    return res.status(400).send({message: "No token provided!"});
  
  jwt.verify(token, config.secret, (error, decoded) => {
    if(error)
      res.status(400).send({message: "Unauthorized!"});

      req.userId = decoded.id;
      next();
  });
};

const isAdmin = async (req, res, next) => {
 await checkRole(2, req, res, next);
};

const isAgent = async (req, res, next) => {
  await checkRole(1, req, res, next);
};

const isCustomer = async (req, res, next) => {
  await checkRole(0, req, res, next);
};

const checkRole = async(role, req, res, next) => {
  const roleString = StaticRoles[role];
  try{
    const user = await User.findById(req.userId).exec();
    const role = await Role.find({_id: {$eq: user.role}}).exec();
    if(role && role.name === roleString)
      next();

    res.status(403).json({message: `Require ${roleString} Role!`});
  } catch(error){
    res.status(500).json({ message: error});
  }
}

module.exports = {verifyToken, isAdmin, isAgent, isCustomer};