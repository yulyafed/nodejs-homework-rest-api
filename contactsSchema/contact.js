const Joi = require("joi");

const contactsSchema = Joi.object({
    name: Joi.string().alphanum().min(2).max(10).required(),
    email: Joi.string().min(2).max(10).required(),
    phone: Joi.string().min(11).max(15).required(),
});

module.exports =  contactsSchema ;