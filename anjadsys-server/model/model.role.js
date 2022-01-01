const { model, Schema } = require("mongoose");

const Role = new Schema({
  name: {type: String, require: true}
}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

module.exports = model('Role', Role);