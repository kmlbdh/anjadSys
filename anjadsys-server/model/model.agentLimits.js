const { model, Schema } = require("mongoose");
const service = new Schema({
  serviceID: {
    type: Schema.Types.ObjectId,
    ref: "Service"
  },
  userID: {
    type: String,
    ref: "User"
  },
  cost: Number,
  customerServiceID: {
    type: Schema.Types.ObjectId,
    ref: "User.services"
  }
}, {_id: false});

const agentLimits = new Schema({
  totalMoney: {type: Number, required: true},
  agentID: {
    type: String,
    ref: "User",
    required: true
  },
  service: {type: service, required: false, default: undefined}
}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

module.exports = model('agentlimits', agentLimits);