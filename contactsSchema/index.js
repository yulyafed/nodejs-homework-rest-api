const { contactSchema, contactsUpdateSchema } = require("./contact");
const authSchema = require("./auth");
const { userSchema } = require("./user");

module.exports = {
    contactSchema,
    contactsUpdateSchema,
    authSchema,
    userSchema
};