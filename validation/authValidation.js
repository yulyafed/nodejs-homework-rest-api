const { authSchema } = require("../contactsSchema");

const authValidation = (authSchema) => {
    return (req, res, next) => {
        const { error } = authSchema.validate(req.body);
        if (error) {
            error.status = 400;
            next(error);
            return;
        }
        next();
    };
};

module.exports = authValidation;