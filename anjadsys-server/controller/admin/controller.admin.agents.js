const db = require("../../models");
const util = require("util");
const customError = require("../../classes/customError");
const errorHandler = require("../../classes/errorhandler");
const sequelize = require("sequelize");
const { Op } = sequelize;

const Account = db.Account;
const sequelizeDB = db.sequelize;
const User = db.User;
const Region = db.Region;

const INTERR = 'INT_ERR';
const LIMIT = 10;
const SKIP = 0;

const addAgentLimitsLog = util.debuglog("controller.admin-AddAgentLimits");
const deleteAgentLimitsLog = util.debuglog("controller.admin-DeleteAgentLimits");
const listAgentLimitsLog = util.debuglog("controller.admin-listAgentLimits");

module.exports = {
  add: async(req, res) => {
    try {
      let { debit, agentID } = req.body;
      addAgentLimitsLog(req.body);
      sequelizeDB.transaction( async t => {
        const account = Account.build({
          debit,
          agentId: agentID
        }, { isNewRecord: true, transaction: t });
  
        const savedAccount = await account.save();
  
        if(!savedAccount && !account.id)
          throw new customError("Failed! Agent limit wasn't added!", INTERR);

        res.status(200).json({message: "Agent limits was added successfully!", data: savedAccount});
      });
    } catch(error) {
      addAgentLimitsLog(error);
      errorHandler(res, error, "Failed! Agent limits wasn't added!");
    }
  },
  delete: async(req, res) => {
    try {
      let { agentLimitID } = req.params;

      if(!agentLimitID || !Number(agentLimitID)) 
        throw new customError("Failed! Agent limits data isn't provided!", INTERR);

      deleteAgentLimitsLog(req.body);
      sequelizeDB.transaction( async t => {
        
        const agentLimits = await Account.destroy({ where: { id: agentLimitID }},
           { transaction: t});

        if(!agentLimits)
          throw new customError("Failed! Agent limits wasn't deleted!", INTERR);
  
        res.status(200).json({message: "Agent limits was deleted successfully!", data: agentLimits});
      });
    } catch(error) {
      deleteAgentLimitsLog(error);
      errorHandler(res, error, "Failed! Agent limits wasn't deleted!");
    }
  },
  list: async(req, res) => {
    try {
      listAgentLimitsLog(req.body);
      let query = {where:{}};

      const limit = req.body.limit || LIMIT;
      const skip = req.body.skip || SKIP;

      if(req.body.accountId) query.where.id = req.body.accountId;

      if (req.body.main) query.where.debit = { [Op.ne]: null };
  
      query = { ...query, 
        order: [['id', 'ASC' ]],
        offset: skip,
        limit: limit,
      };

      if(req.body.accountId){
        query.include = [
          {
            model: User,
            as: 'Agent',
            required: true,
            include: [
              {
                model: Region,
                required: true
              }
            ]
          }
        ];
      }
      
      if (req.body.agentID) query.where = {agentId: req.body.agentID};

      const { count, rows: agentLimits } = await Account.findAndCountAll(query);
  
      listAgentLimitsLog(agentLimits);
      res.status(200).json({data: agentLimits, count});
    } catch(error) {
      listAgentLimitsLog(error);
      errorHandler(res, error, "Failed! can't list agent limits!");
    }
  },
};