const db = require("../../models");
const util = require("util");
const customError = require("../../classes/customError");
const errorHandler = require("../../classes/errorhandler");
const sequelize = require("sequelize");
const { Op } = sequelize;

const User = db.User;
const Role = db.Role;
const Region = db.Region;
const Account = db.Account;
const Endorsement = db.Endorsement;
const Car = db.Car;
const CarType = db.CarType;
const CarModel = db.CarModel;
const ServicePolicy = db.ServicePolicy;
const Service = db.Service;
const InsurancePolicy = db.InsurancePolicy;
const sequelizeDB = db.sequelize;

const INTERR = 'INT_ERR';
const LIMIT = 10;
const SKIP = 0;

const updateEndorsementLog = util.debuglog("controller.admin-UpdateEndorsement");
const addEndorsementLog = util.debuglog("controller.admin-AddEndorsement");
const deleteEndorsementLog = util.debuglog("controller.admin-DeleteEndorsement");
const listEndorsementLog = util.debuglog("controller.admin-ListEndorsement");

module.exports = {
  add: async(req, res) => {
    try {
      let {
        totalPrice,
        note,
        expireDate,
        endorsementType,
        insurancePolicyId,
        carId,
      } = req.body;

     await sequelizeDB.transaction( async t => {

        const endorsement = Endorsement.build({
          totalPrice,
          expireDate,
          note,
          endorsementType,
          insurancePolicyId,
          carId,
        }, { isNewRecord: true, transaction: t });

        const savedEndorsement = await endorsement.save();

        if(!savedEndorsement || !savedEndorsement.id)
          throw new customError("Failed! Endorsement wasn't added!", INTERR);

        if( totalPrice != null ) {
          const account = Account.build({
            endorsementId: endorsement.id,
            credit: totalPrice,
          }, { 
            isNewRecord: true,
            transaction: t 
          });

          const savedAccount = await account.save();

          if(!savedAccount)
            throw new customError("Failed! Account wasn't added!", INTERR);
        }

        res.status(200).json({
          message: "Endorsement was added successfully!",
          data: savedEndorsement.toJSON(),
        });
      });
    } catch(error) {
      addEndorsementLog(error);
      errorHandler(res, error, "Failed! Endorsement wasn't added!");
    }
  },
  delete: async(req, res) => {
    try {
      const { endorsementId } = req.params;
      
      if(!endorsementId || !Number(endorsementId))
        throw new customError("Failed! Endorsement data isn't provided!", INTERR);

      await sequelizeDB.transaction( async t => {

        // const deletedAccount = await Account.destroy({ where: { endorsementId: endorsementId }}, 
        //   {transaction: t});
    
        // if(!deletedAccount)
        //   throw new customError("Failed! Account wasn't deleted!", INTERR);

        const deletedEndorsement = await Endorsement.destroy({ where: { id: endorsementId }}, 
          {transaction: t});

        if(!deletedEndorsement)
          throw new customError("Failed! Endorsement isn't deleted!", INTERR);

        res.status(200).json({
          message: "Endorsement was deleted successfully!",
          data: deletedEndorsement
        });
      });

    } catch(error) {
      deleteEndorsementLog(error);
      errorHandler(res, error, "Failed! Endorsement isn't deleted!");
    }
  },
  update: async(req, res) => {
    try {
      let { totalPrice } = req.body;

      const { endorsementId } = req.params;
      
      if(!endorsementId || !Number(endorsementId))
        throw new customError("Failed! Endorsement data isn't provided!", INTERR);
  
      await sequelizeDB.transaction( async t => {
        const query = { where: {id: endorsementId} };
        const updateData = {};

        Object.entries(req.body).forEach((val, ind) => {
          updateEndorsementLog(val[0], val[1])
          if(val && val.length > 0 && val[0] !== 'endorsementId')
            updateData[val[0]] = val[1];
        });

        updateEndorsementLog(updateData);
        const updatedEndorsement = await Endorsement.update(updateData, query);
        
        if(updatedEndorsement[0]!== 1) 
          throw new customError("Failed! Endorsement isn't updated!", INTERR);
        
        if (totalPrice != null){
          const updatedAccount = await Account.update({credit: totalPrice}, {where: { endorsementId: endorsementId}}, { transaction: t});
    
          if(!updatedAccount)
            throw new customError("Failed! Account wasn't updated!", INTERR);
        }

        res.status(200).json({
          message: "Endorsement was updated successfully!", 
          data: updatedEndorsement[0]
        });
      });
      
    } catch(error) {
      updateEndorsementLog(error);
      errorHandler(res, error, "Failed! Endorsement wasn't updated!");
    }
  },
  list: async(req, res) => {
    try{

      let customerWhere = {};
      let query = {where:{}};
      const limit = req.body.limit || LIMIT;
      const skip = req.body.skip || SKIP;
 
      if (req.body.endorsementId) 
        query.where.id = req.body.endorsementId;

      if (req.body.insurancePolicyId) 
        query.where.insurancePolicyId = req.body.insurancePolicyId;
      
      if (req.body.carID) 
        query.where.carId = req.body.carID;

      if (req.body.customerId)
        customerWhere = { 'id': req.body.customerId };

      if(req.body.filterOutValid){
        query.where.expireDate = {[Op.gte]: new Date().setHours(0, 0, 0, 0)}
      }
        
      if(Object.keys(query.where) === 0 ) delete query.where;
      
      query = { ...query,
        order: [['createdAt', 'DESC' ]],
        include: [
        {
          model: InsurancePolicy,
          required: true,
          include:[
            {
              model: ServicePolicy,
              required: true,
              separate: true,
              include: [
                {
                  model: Service,
                  required: true,
                  attributes: ['id', 'name', 'cost', 'coverageDays', 'supplierPercentage']
                },
                {
                  model: User,
                  as: 'Supplier',
                  required: true,
                  attributes: ['id', 'username', 'companyName']
                }
              ]
            },
            {
              model: User,
              required: true,
              as: 'Agent',
              include:[
                {
                  model: Role,
                  required: true
                },
                {
                  model: Region,
                  required: true
                }
              ],
              attributes: { exclude: ['password', 'note'] }
            },
            {
              model: User,
              required: true,
              as: 'Customer',
              include:[
                {
                  model: Role,
                  required: true
                },
                {
                  model: Region,
                  required: true
                }
              ],
              where: customerWhere,
              attributes: { exclude: ['password', 'note'] }
            },
            {
              model: Car,
              required: true,
              include: [
                {
                  model: CarType,
                  require: true,
                },
                {
                  model: CarModel,
                  require: true,
                }
              ]
            }
          ],
        },
        {
          model: Car,
          required: true,
          include: [
            {
              model: CarType,
              require: true,
            },
            {
              model: CarModel,
              require: true,
            }
          ]
        }
      ],
        offset: skip,
        limit: limit,
      };

      //TODO doesn't make sense! what is for?
      // if (req.body.agentID)
      //   query.include[2].where.agentId = req.body.agentID;

      let { count, rows: endorsements } = await Endorsement.findAndCountAll(query);

      //TODO for expire date - later on
      // if(req.body.filterOutValid){
      //   if(count === 0)
      //     throw new customError("لا يوجد بوليصة تأمين متاحة او غير منتهية", INTERR);
      // }

      listEndorsementLog(query);
      res.status(200).json({data: endorsements, total: count});
    } catch(error) {
      listEndorsementLog(error);
      errorHandler(res, error, "Failed! can't get Endorsements!");
    }
  },
};

/* ######################### Internal Method ##################### */

// const checkLimits = async (req) => {
//   const totalDebit = await Account.findAll({
//     where: { agentId: req.body.agentId },
//     attributes: [
//        [sequelize.fn('sum', sequelize.col('debit')), 'debit'],
//     ],
//     group: ['agentId']
//   });

//   const totalCredit = await Account.findAll({
//     include:[
//       {
//         model: InsurancePolicy,
//         require: true,
//         where: { agentId: req.body.agentId },
//         attributes: []
//       }
//     ],
//     attributes: [
//        [sequelize.fn('sum', sequelize.col('credit')), 'credit'],
//     ],
//     group: ['InsurancePolicy.agentId']
//   });

//   let totalDebitVal = Number(totalDebit[0]?.debit || 0),
//       totalCreditVal = Number(totalCredit[0]?.credit || 0),
//       totalPricePolicy = Number(req.body.totalPrice);

//     let finalAccount = ((totalDebitVal - (totalCreditVal + totalPricePolicy)) > 0);
//     return finalAccount;
// }
