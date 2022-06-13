const jwt = require("jsonwebtoken");
const db = require("../../models");
const bcrypt = require("bcryptjs");
const util = require("util");
const customError = require("../../classes/customError");
const errorHandler = require("../../classes/errorhandler");

//debugging NOT FOR PRODUCTION 
const loginLog = util.debuglog("controller.shared-Login");

const User = db.User;
const Role = db.Role;

const INTERR = 'INT_ERR';

module.exports = {
  login: async(req, res) => {
    try{
      const { username: loginUsername, password } = req.body;
      loginLog(loginUsername, password);

      const user = await User.scope('withPassword').findOne({ where: 
        {
          id: loginUsername,
          blocked: false
        },
        include: [{
          model: Role,
          required: true,
        }],
        attributes: { exclude: ['roleId']}
      });
      
      if(!user)
        throw new customError("User not found!", INTERR);

      let validPassword = await bcrypt.compare(password, user.password);

      if(!validPassword)
        throw new customError("Failed! Wrong Password!", INTERR);

      loginLog(validPassword);

      const { id, username, companyName, Role: { name: role }} = user;
      const accessToken = jwt.sign({id}, process.env.TOKEN_SECRET, {expiresIn: 86400});

      loginLog(accessToken);

      const userData = {
        id,
        username,
        companyName,
        role,
        accessToken
      };
      res.status(200).json({data: userData});
    } catch(error){
      loginLog(error);
      errorHandler(res, error, "Failed! Can/'t sign in");
    }
  }
}