const { model, Schema } = require("mongoose");

const Service = new Schema({
  name: {type: String, required: true, unique: true},
  coverDays: {type: Number, required:true},
  cost: {type: Number, required: true},
  note: String,
  dailyCost: {type: Number, required: true}
}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

module.exports = model('Service', Service);