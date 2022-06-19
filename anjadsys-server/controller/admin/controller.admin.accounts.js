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
      let query = {where:{}};
      let agentBalance = 0;

      const limit = req.body.limit || LIMIT;
      const skip = req.body.skip || SKIP;
 
      if (req.body.accountId){
        query.where.id = req.body.accountId;
      }

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

      if (req.body.agentID){
        query.where[Op.or] = [
          {agentId: req.body.agentID},
          {'$InsurancePolicy.agentId$': req.body.agentID},
        ];
        agentBalance = await agentAccount(req);
      }

      // if (req.body.customerID)
      //   query.where.customerID = req.body.customerID;
        
      if(Object.keys(query.where) === 0 ) delete query.where;

      if(req.body.insurancePolicyId){
        query = { ...query,
          order: [['createdAt', 'DESC' ]],
          include: [
            {
              model: InsurancePolicy,
              required: true,
              where: {id: req.body.insurancePolicyId}
            }
          ],
          offset: skip,
          limit: limit,
        };
      } else {
          query = { ...query,
            order: [['createdAt', 'DESC' ]],
            include: [
              {
                model: InsurancePolicy,
                required: false,
                // where: { agentId: req.body.agentID },
              },
              {
                model: User,
                required: false,
                // where: { id: req.body.agentID },
                attributes: { exclude: ['passowrd']}
              },
            ],
            offset: skip,
            limit: limit,
          };     
      }
      
      var { count, rows: accounts } = await Account.findAndCountAll(query);
  
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
    where: { agentId: req.body.agentID },
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
        where: { agentId: req.body.agentID },
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
