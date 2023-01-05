const { contactsSchema } = require("../contactsSchema");

const validation = (contactsSchema) => {
    return (req, _, next) => {
        const { error } = contactsSchema.validate(req.body);
        if (error) {
            error.status = 400;
            next(error);
            return;
        }
        next();
    };
};

module.exports = { validation} ;