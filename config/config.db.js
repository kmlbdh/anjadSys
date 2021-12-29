const mongoose = require("mongoose");

const DB_CONFIG = Object.seal({
  USER: "backendUser",
  PASS: "OBADAKAMAL--=1988",
  // HOST: "localhost",
  HOST : ['localhost:27017', 'localhost:27018', 'localhost:27019'],
  PORT: 27017,
  DB: "anjad_db",
});

// const MONGO_URI = `mongodb://${DB_CONFIG.USER}:${DB_CONFIG.PASS}
//   @${DB_CONFIG.HOST}:${DB_CONFIG.PORT}/${DB_CONFIG.DB}?authSource=admin`;
  const MONGO_URI = `mongodb://${DB_CONFIG.USER}:${DB_CONFIG.PASS}@${DB_CONFIG.HOST.join(',')}/${DB_CONFIG.DB}?replicaSet=rs&authSource=admin`;

module.exports.connect = async () => {
  let con;
  try{
    con =  await mongoose.connect(MONGO_URI);
    console.log("Successfully connected to database");
    return con;
  } catch(error) {
    console.log("database connection failed. exiting now ...");
    console.log(error);
    process.exit(1);
  }
};