const { model, Schema} = require("mongoose");

const User = new Schema({
  refId:{type: String, require: true, unique: true},
  username: {type: String, require: true},
  nickname:{type: String, default: null},
  password: {type: String, require: true},
  phone: {type: String, require: true},
  tel: {type: String, require: true},
  note: {type: String, require: false, default: null},
  role: {
      type: Schema.Types.ObjectId,
      ref: "Role"
  }
}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}});

module.exports = model('User' , User);