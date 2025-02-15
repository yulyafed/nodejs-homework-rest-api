const { contactsSchema, contactsUpdateSchema} = require("../contactsSchema");

const validation = (contactsSchema) => {
    return (req, res, next) => {
        const { error } = contactsSchema.validate(req.body);
        if (error) {
            error.status = 400;
            next(error);
            return;
        }
        next();
    };
};

const updateValidation = (contactsUpdateSchema) => {
    return (req, res, next) => {
        const { error } = contactsUpdateSchema.validate(req.body);
        if (error) {
            error.status = 400;
            next(error);
            return;
        }
        next();
    };
};

module.exports =  validation, updateValidation ;