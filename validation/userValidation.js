const { userSchema } = require("../contactsSchema");

const userValidation = (userSchema) => {
    return (req, res, next) => {
        const { error } = userSchema.validate(req.body);
        if (error) {
            error.status = 400;
            next(error);
            return;
        }
        next();
    };
};

module.exports = userValidation;