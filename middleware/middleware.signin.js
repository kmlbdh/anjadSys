const validation = require("./middleware.validation");
const { schema } = require("../schema/schema.validation");

const validateSignin = validation(schema.singin, 'body');

module.exports = {validateSignin};