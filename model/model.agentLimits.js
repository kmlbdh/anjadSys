const { model, Schema } = require("mongoose");

const agentLimits = new Schema({
  totalMoney: {type: String, required: true},
  agentID: {
    type: String,
    ref: "User",
    required: true
  },
  service: { type: {
      serviceID: {
        type: Schema.Types.ObjectId,
        ref: "Service"
      },
      userID: {
        type: String,
        ref: "User"
      },
      cost: Number
    }, 
    required: false,
    default: undefined
  },
}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

module.exports = model('agentlimits', agentLimits);