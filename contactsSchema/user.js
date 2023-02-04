const Joi = require("joi");

const userSchema = Joi.object({
    email: Joi.string().email().required(),
});

module.exports = { userSchema };


