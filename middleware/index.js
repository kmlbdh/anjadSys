const verifySingUp = require("./middleware.signup");
const verifySingIn = require("./middleware.signin");
const auth = require("./middleware.auth");

module.exports = {verifySingUp, auth, verifySingIn};