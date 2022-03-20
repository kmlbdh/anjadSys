const config = require("../config/config.auth");
const jwt = require("jsonwebtoken");
const db = require("../models");
const bcrypt = require("bcryptjs");
const AutoID = require("auto-id-builder");
const util = require("util");
const customError = require("../classes/customError");
const errorHandler = require("../classes/errorhandler");
const { query } = require("express");

//debugging NOT FOR PRODUCTION 
const createUserLog = util.debuglog("controller.shared-createUser");
const updateUserLog = util.debuglog("controller.shared-updateUser");
const createUniqueRefIdLog = util.debuglog("controller.shared-createUniqueRefId");
const getUserLastIdLog = util.debuglog("controller.shared-getLastId");
const loginLog = util.debuglog("controller.shared-login");
const listUsersLog = util.debuglog("controller.shared-listUsers");
const listServicesLog = util.debuglog("controller.shared-listServices");
const listAgentLimitsLog = util.debuglog("controller.shared-listAgentLimits");
const deleteUserLog = util.debuglog("controller.shared-deleteUser");


const User = db.User;
const Role = db.Role;
const Service = db.Service;
const Accident = db.Accident;
const Account = db.Account;
const UserAccount = db.User_Account;
const Car = db.Car;
const CarModel = db.CarModel;
const CarType = db.CarType;
const InsurancePolicy = db.InsurancePolicy;
const Region = db.Region;
const ServiceAccident = db.ServiceAccident;
const ServicePolicy = db.ServicePolicy;

const INTERR = 'INT_ERR';
const LIMIT = 10;
const SKIP = 0;

const IdPrefixByRole = {
  admin: {
    shortPrefix: 'AD',
    length: 3
  },
  agent: {
    shortPrefix: 'AG',
    length: 6
  },
  customer: {
    shortPrefix: 'C',
    length: 8
  },
  supplier: {
    shortPrefix: 'SUP',
    length: 5
  }
};

const shared = {
  userShared: {
    createUser: async(res, data) => {
      let {
        identityNum,
        username,
        companyName,
        password,
        address,
        jawwal1,
        jawwal2,
        fax,
        tel,
        email,
        note,
        roleId,
        regionId,
        agentId,
        roleName
      } = data;
  
      const id = await createUniqueRefId(roleId, roleName);
  
      if(!id)
        throw new customError("Failed! can't generate User Id!", INTERR);
  
      createUserLog(id);
      password = password ? bcrypt.hashSync(password): undefined;
    
      try{
        const user = User.build({
          id,
          identityNum,
          username,
          companyName,
          password,
          address,
          jawwal1,
          jawwal2,
          fax,
          tel,
          email,
          note,
          roleId,
          regionId,
          agentId
        });
        
        const savedUser = await user.save();
        if(!savedUser)
          throw new customError("Failed! User wasn't registered!", INTERR);
  
        res.status(200).json({message: "User was registered successfully!", data: savedUser.toJSON()});
      } catch(error) {
        createUserLog(error);
        errorHandler(res, error, "Failed! User wasn't registered!");
      }
    },
    updateUser: async(res, query, update) => {
      try{
        const updatedUser = await User.update(update, query);
        updateUserLog(updatedUser[0]);

        if(updatedUser[0]!== 1) 
          throw new customError("Failed! user isn't updated!", INTERR);
  
        res.status(200).json({message: "User was updated successfully!", data: updatedUser[0]});
      } catch(error) {
        updateUserLog(error);
        errorHandler(res, error, "Failed! User wasn't updated!");
      }
    },
    deleteUser: async(res, query) => {
      try{
        const deletedUser = await User.destroy(query);
        
        deleteUserLog(deletedUser);
        
        if(!deletedUser)
          throw new customError("Failed! User isn't removed!", INTERR);
  
        res.status(200).json({message: "User was removed successfully!", data: deletedUser});
      } catch(error) {
        deleteUserLog(error);
        errorHandler(res, error, "Failed! User isn't removed!");
      }
    },
    listUsers: async(res, query, skip, limit,
       requiredAgentJoin = false) => {
      try{
        query = { ...query, 
          order: [['id', 'ASC' ]],
          include: [{
            model: Region,
            required: true,
          },
          {
            model: Role,
            required: true,
          },
          {
            model: User,
            required: requiredAgentJoin,
            as: 'Agent',
            attributes: { exclude: ['password', 'note'] }
          }],
          offset: skip,
          limit: limit,
          attributes: { exclude: ['regionId', 'roleId', 'agentId']}
        };
        listUsersLog(query);
        const { count, rows: users } = await User.findAndCountAll(query);
    
        // listUsersLog(users);
        res.status(200).json({data: users, total: count});
      } catch(error){
        listUsersLog(error);
        errorHandler(res, error, "Failed! Can't get users!");
      }
    },
  },

  listServices: async(res, query, skip, limit) => {
    try{
      query = { ...query, 
        order: [['id', 'ASC' ]],
        offset: skip,
        limit: limit,
      };
      const { count , rows: services} = await Service.findAndCountAll(query);
  
      listServicesLog(services);
      res.status(200).json({data: services, total: count});
    } catch(error){
      listServicesLog(error);
      errorHandler(res, error, "Failed! Can't get services!");
    }
  },
  listAgentLimits: async(res, query, skip, limit) => {
    try{
      query = { ...query, 
        order: [['id', 'ASC' ]],
        include:[
          {
            model: UserAccount,
            required: true
          }
        ],
        offset: skip,
        limit: limit,
      };

      const { count, rows: agentLimits } = await Account.findAndCountAll(query);
  
      listAgentLimitsLog(agentLimits);
      res.status(200).json({data: agentLimits, count});
    } catch(error){
      listAgentLimitsLog(error);
      errorHandler(res, error, "Failed! Can't get agent limits!");
    }
  },
  login: async(req, res) => {
    try{
      const { username: loginUsername, password } = req.body;
      loginLog(loginUsername, password);

      const user = await User.scope('withPassword').findOne({ where: 
        {
          id: loginUsername
        },
        include: [{
          model: Role,
          required: true,
        }],
        attributes: { exclude: ['roleId']}
      });
      
      if(!user)
        throw new customError("User not found!", INTERR);
  
      let validPassword = bcrypt.compareSync(password, user.password);

      if(!validPassword)
        throw new customError("Failed! Wrong Password!", INTERR);
  
      loginLog(validPassword);

      const { id, username, companyName, Role: { name: role }} = user;
      const accessToken = jwt.sign({id}, config.secret, {expiresIn: 86400});

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
};

const createUniqueRefId = async (roleId, roleName) => {
  createUniqueRefIdLog("roleName" + roleName);
  const prefix = IdPrefixByRole[roleName];
  if(!prefix)
    throw new customError("Failed! can't get prefix", INTERR);

  const lastUserId = await getUserLastId(roleId);

  createUniqueRefIdLog(lastUserId);
  const alphaNumericID = AutoID()
    .newFormat()
    .addPart(true, prefix.shortPrefix, 2)
    .addPart(true, '-', 1)
    .addPart(false, 'number', prefix.length)
    .compile();
    
  const ID = alphaNumericID.generateID(lastUserId);
  createUniqueRefIdLog(ID);
  return ID;
};

const getUserLastId = async (roleId) => {
  try{
      getUserLastIdLog(roleId);
      const user = await User.findOne({
        where: { roleId: roleId },
        order: [['createdAt', 'DESC' ]]
      });
      getUserLastIdLog(user);
      return user?.id;
  } catch(error) {
    getUserLastIdLog(error);
    errorHandler(res, error, "Failed! can't get last user!");
  }
};

module.exports = shared;