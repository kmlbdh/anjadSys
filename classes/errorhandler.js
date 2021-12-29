const INTERR = 'INT_ERR';
const util = require("util");

const errorHandlingLog = util.debuglog("ErrorHandling");

function errorHandler(res, error, defaultError, respStatus = 500, runDebug = false) {
  if(runDebug) errorHandlingLog(error);
  const messageOfCustomError = error.code === INTERR ? error.message : defaultError;
  res.status(respStatus).json({message: messageOfCustomError });
};

module.exports = errorHandler;