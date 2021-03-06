const { model, Schema} = require("mongoose");

const userAgent = new Schema({
  agentID: {
    type: String,
    ref: "User"
  },
  agentNickname: {type: String},
   
}, {_id: false});

const userServices = new Schema({
    serviceID: {
      type: Schema.Types.ObjectId,
      ref: "Service"
    },
    serviceName: String,
    price: {type: Number, required: true},
    period: {type: Number, required: true},
    startDate: {type: Date, required: true, default: Date.now()},
    endDate: {type: Date, required: true},
    additionalDays: {type: Number, required: false, default: undefined},
    dailyCost: {type: Number, required: false, default: undefined}
}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

const User = new Schema({
  _id: String,
  username: {type: String, required: true},
  nickname:{type: String, required: false, default: undefined},
  password: {type: String, required: false, default: undefined},
  address: {type: String, required: false, default: undefined},
  phone: {type: String, required: false, default: undefined},
  tel: {type: String, required: false, default: undefined},
  note: {type: String, required: false, default: undefined},
  role: { type: String, required: true},
  agent: {type: userAgent,required: false, default: undefined},
  services: {type: [userServices], required: false, default: undefined}
}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

module.exports = model('User' , User);