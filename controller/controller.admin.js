const db = require("../model");
const util = require("util");
// const customError = require("../classes/customError");

const User = db.userModel;
// const Role = db.roleModel;
// const mongoose = db.mongoose;
const INTERR = 'INT_ERR';

//debugging NOT FOR PRODUCTION
const listUsersLog = util.debuglog("controller.admin-ListUsers");

const listUsers = async(req, res) => {
  const role = req.body.role ? req.body.role : {$ne: ""};
  const limit = req.body.limit ? req.body.limit : 20;
  const skip = req.body.skip ? req.body.skip : 0;

  listUsersLog(role);
  try{
    const users = await User.aggregate([
      {
        $lookup: {
          from: "roles",
          localField: "role",
          foreignField: "_id",
          as: "role",
        }
      },
      {
        $match: {"role.name": role}
      },
      { 
        $unwind: "$role" 
      },
      {
        $project: {"_id": 1, "refId": 1, "username": 1, "nickname": 1, "phone": 1, "tel":1, "note": 1,
        "role": "$role.name", "created_at": 1}
      },
      {
        $sort: {"created_at": -1}
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
  ]).exec();
    listUsersLog(users);
    res.status(200).json({users: users});
  } catch(error){
    listUsersLog(error);
    let messageOfCustomError = error.code === INTERR ? error.message : "Failed! Can/'t get users!";
    res.status(500).json({message: messageOfCustomError});
  }
};

module.exports = {listUsers};