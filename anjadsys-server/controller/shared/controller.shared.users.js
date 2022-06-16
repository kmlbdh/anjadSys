const db = require("../../models");
const bcrypt = require("bcryptjs");
const util = require("util");
const AutoID = require("auto-id-builder");
const customError = require("../../classes/customError");
const errorHandler = require("../../classes/errorhandler");

//debugging NOT FOR PRODUCTION 
const createUserLog = util.debuglog("controller.shared-createUser");
const updateUserLog = util.debuglog("controller.shared-updateUser");
const listUsersLog = util.debuglog("controller.shared-listUsers");
const lightListUsersLog = util.debuglog("controller.shared-lightListUsers");
const deleteUserLog = util.debuglog("controller.shared-deleteUser");
const createUniqueRefIdLog = util.debuglog("controller.shared-createUniqueRefId");
const getUserLastIdLog = util.debuglog("controller.shared-getUserLastId");

const User = db.User;
const Role = db.Role;
const Region = db.Region;

const INTERR = 'INT_ERR';

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

module.exports = {
  add: async(res, data) => {
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
      roleName,
      servicesPackage = null
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
        agentId,
        servicesPackage
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
  update: async(res, query, update) => {
    try{
      updateUserLog(update);
      if(update.password){
        update.password = bcrypt.hashSync(update.password);
        delete update.confirmPassword;
      }

      const updatedUser = await User.update(update, query);
      updateUserLog(updatedUser[0]);

      if(updatedUser[0] !== 1) 
        throw new customError("Failed! user isn't updated!", INTERR);

      res.status(200).json({message: "User was updated successfully!", data: updatedUser[0]});
    } catch(error) {
      updateUserLog(error);
      errorHandler(res, error, "Failed! User wasn't updated!");
    }
  },
  delete: async(res, query) => {
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
  list: async(res, query, skip, limit, requiredAgentJoin = false) => {
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
          include: [
            {
              model: Region,
              required: true,
            }
          ],
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
  lightList: async(res, query, skip, limit) => {
    try{
      query = { ...query, 
        order: [['id', 'ASC' ]],
        include: [
        {
          model: Role,
          required: true,
        }],
        offset: skip,
        limit: limit,
        attributes: ['id', 'username', 'companyName']
      };
      lightListUsersLog(query);
      const { count, rows: users } = await User.findAndCountAll(query);
  
      // lightListUsersLog(users);
      res.status(200).json({data: users, total: count});
    } catch(error){
      lightListUsersLog(error);
      errorHandler(res, error, "Failed! Can't get users!");
    }
  },
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