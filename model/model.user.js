const { model, Schema} = require("mongoose");

const User = new Schema({
  fName: {type: String, require: true},
  refId:{type: Number, require: true},
  nickName:{type: String, default: null},
  password: {type: String, require: true},
  phone: {type: String, require: true},
  tel: {type: String, require: true},
  note: {type: String, require: false, default: null},
  roles: [
    {
      type: Schema.Types.ObjectId,
      ref: "Role"
    }
  ]
});

module.exports = model('User' , User);