const Joi = require("joi");

const contactSchema = Joi.object({
    name: Joi.string().alphanum().min(2).max(20).required(),
    email: Joi.string().min(8).max(20).required(),
    phone: Joi.string().min(11).max(15).required(),
    favorite: Joi.boolean(),
});

const contactsUpdateSchema = Joi.object({
    name: Joi.string().alphanum().min(2).max(20),
    email: Joi.string().min(8).max(20),
    phone: Joi.string().min(11).max(15),
    favorite: Joi.boolean(),
});

module.exports = contactSchema, contactsUpdateSchema;