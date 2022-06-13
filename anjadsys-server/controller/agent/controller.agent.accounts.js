const db = require("../../models");
const util = require("util");
const errorHandler = require("../../classes/errorhandler");
const sequelize = require("sequelize");
const { Op } = sequelize;

const User = db.User;
const Account = db.Account;
const InsurancePolicy = db.InsurancePolicy;

const LIMIT = 10;
const SKIP = 0;

const listAccountLog = util.debuglog("controller.admin-ListAccount");

module.exports = {
  list: async(req, res) => {
    try{
      let query = { where: {}};
      const limit = req.body.limit || LIMIT;
      const skip = req.body.skip || SKIP;
 
      if (req.body.accountId) 
        query.where.id = req.body.accountId;

      if (req.body.startDate && req.body.endDate){
        query.where.createdAt = {
          [Op.between]: [
            new Date(req.body.startDate).setHours(0, 0, 0, 0),
            new Date(req.body.endDate).setHours(23, 59 , 59, 59)
          ]
        };
      } else if(req.body.startDate){
        query.where.createdAt = {
          [Op.gte]: new Date(req.body.startDate).setHours(0, 0, 0, 0),
        };
      } else if(req.body.endDate){
        query.where.createdAt = {
          [Op.lte]: new Date(req.body.endDate).setHours(23, 59 , 59, 59),
        };
      }

      if (!req.body.insurancePolicyId){
        query.where[Op.or] = [{agentId: req.agent.id}, {'$InsurancePolicy.agentId$': req.agent.id}]
      } 

      // if (req.body.customerID)
      //   query.where.customerID = req.body.customerID;
        
      if(Object.keys(query.where) === 0 ) delete query.where;

      if(req.body.insurancePolicyId){
        query = { ...query,
          order: [['id', 'ASC' ]],
          include: [{
            model: InsurancePolicy,
            required: true,
            where: { agentId : req.agent.id, id: req.body.insurancePolicyId }
          },
        ],
          offset: skip,
          limit: limit,
        };
      } else {
        query = { ...query,
          order: [['id', 'ASC' ]],
          include: [
            {
              model: InsurancePolicy,
              required: false,
              // where: { agentId: req.agent.id}
            },
            {
              model: User,
              required: false,
              attributes: { exclude: ['passowrd']}
            },
          ],
          offset: skip,
          limit: limit,
        };
      }

      const { count, rows: accounts } = await Account.findAndCountAll(query);

      let agentBalance = await agentAccount(req);
  
      listAccountLog(query);
      res.status(200).json({data: accounts, agentBalance, total: count});
    } catch(error) {
      listAccountLog(error);
      errorHandler(res, error, "Failed! can't get Accounts!");
    }
  },
};

const agentAccount = async (req) => {
  const totalDebit = await Account.findAll({
    where: { agentId: req.agent.id },
    attributes: [
       [sequelize.fn('sum', sequelize.col('debit')), 'debit'],
    ],
    group: ['agentId']
  });

  const totalCredit = await Account.findAll({
    include:[
      {
        model: InsurancePolicy,
        require: true,
        where: { agentId: req.agent.id },
        attributes: []
      }
    ],
    attributes: [
       [sequelize.fn('sum', sequelize.col('credit')), 'credit'],
    ],
    group: ['InsurancePolicy.agentId']
  });

  let totalDebitVal = Number(totalDebit[0]?.debit || 0),
      totalCreditVal = Number(totalCredit[0]?.credit || 0);

    let finalAccount = totalDebitVal - totalCreditVal;
    return finalAccount;
}