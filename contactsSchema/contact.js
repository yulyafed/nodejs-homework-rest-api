const Joi = require("joi");

const contactsSchema = Joi.object({
    name: Joi.string().alphanum().min(2).max(20).required(),
    email: Joi.string().min(2).max(20).required(),
    phone: Joi.string().min(11).max(15).required(),
});

const contactsUpdateSchema = Joi.object({
    name: Joi.string().alphanum().min(2).max(20),
    email: Joi.string().min(2).max(20),
    phone: Joi.string().min(11).max(15),
});

module.exports =  contactsSchema, contactsUpdateSchema  ;