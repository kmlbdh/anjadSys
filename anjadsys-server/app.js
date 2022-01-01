require("dotenv").config();
const con = require("./config/config.db").connect();
const express = require("express");
const mainRoute = require("./routes/route.main");
const adminRoute = require("./routes/route.admin");
const agentRoute = require("./routes/route.agent");
// Temp require
const {roleModel: Role, userModel: User} = require("./model");
const bcrypt = require("bcryptjs");

const app = express();

// Temporary inserition
initial();
async function initial(){
  try{
    const SECRET = bcrypt.hashSync("12345");
    const count = await Role.estimatedDocumentCount();

    if(count === 0){
      const customer = await new Role({name: "customer"}).save();
      if(!customer) console.log("error");
      console.log("added 'customer' to roles collections");

      const agent = await new Role({name: "agent"}).save();
      if(!agent) console.log("error");
      console.log("added 'agent' to roles collections");

      const admin = await new Role({name: "admin"}).save();
      if(!admin) console.log("error");
      console.log("added 'admin' to roles collections");

      const supplier = await new Role({name: "supplier"}).save();
      if(!supplier) console.log("error");
      console.log("added 'supplier' to roles collections");
    }

    const adminCount = await User.estimatedDocumentCount();
    if(adminCount === 0){
      const admin = await new User({
        _id: "AD-001",
        username: "obada",
        nickname: "newUser",
        password: SECRET,
        phone: "2228220",
        tel: "0569137015",
        role: "admin"
      }).save();
      if(!admin) console.log("error");
      console.log("added 'AD-001' as admin with password '12345' to users collections");
    }
  } catch(error){
    console.log(error);
  }
}

app
  .use(express.json())
  .use(express.urlencoded({extended: true}));

mainRoute(app);
adminRoute(app);
agentRoute(app);

module.exports = app;