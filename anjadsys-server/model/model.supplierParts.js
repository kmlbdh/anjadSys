const { model, Schema } = require("mongoose");

const supplierParts = new Schema({
  partNo: String,
  partName: {type: String, required: true },
  quantity: {type: Number, required: true},
  cost: {type: Number, required: true},
  supplierID: { 
    type: String,
    ref: "User",
    required: true
  },
}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

module.exports = model('supplierparts', supplierParts);