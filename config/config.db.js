const mongoose = require("mongoose");

const DB_CONFIG = Object.seal({
  USER: "backendUser",
  PASS: "OBADAKAMAL--=1988",
  HOST: "localhost",
  PORT: 27017,
  DB: "anjad_db",
});

const MONGO_URI = `mongodb://${DB_CONFIG.USER}:${DB_CONFIG.PASS}@${DB_CONFIG.HOST}:${DB_CONFIG.PORT}/${DB_CONFIG.DB}?authSource=admin`


module.exports.connect = async () => {
  console.log(MONGO_URI);
  try{
    await mongoose.connect(MONGO_URI);
    console.log("Successfully connected to database");
  } catch(error) {
    console.log("database connection failed. exiting now ...");
    console.log(error);
    process.exit(1);
  }
};