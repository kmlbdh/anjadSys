const { model, Schema } = require("mongoose");

const Role = new Schema({
  name: {type: String, require: true}
});

module.exports = model('Role', Role);