const INTERR = 'INT_ERR';
const util = require("util");

const errorHandlingLog = util.debuglog("ErrorHandling");

function errorHandler(res, error, defaultError, respStatus = 400, runDebug = false) {
  // if(runDebug) errorHandlingLog(error);
   console.log('here weeeeeeeeeee are', error.code === INTERR);
  let messageOfCustomError;
  if (error.code === INTERR) {
    messageOfCustomError =  error.message;
  } else if(error.parent && error.parent.code === 'ER_DUP_ENTRY'){
    let keys = Object.keys(error.fields);
    let values = [];
    keys.forEach(k => values.push(error.fields[k]));
    messageOfCustomError =  "البيانات التالية مكررة: " + values.toString();
  } else {
    respStatus = 500
    messageOfCustomError = defaultError;
  }
  res.status(respStatus).json({message: messageOfCustomError });
};

module.exports = errorHandler;