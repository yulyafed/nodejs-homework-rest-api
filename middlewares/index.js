const jwt = require("jsonwebtoken");
const { HttpError} = require('../helpers')
const { User } = require("./../models/users");

const secret = `${process.env.JWT_SECRET}`;

async function auth(req, res, next) {
    const authHeader = req.headers.authorization || "";
    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer") {
        throw HttpError(401, "token type is not valid");
    }

    if (!token) {
        throw HttpError(401, "Not authorized");
    }

    try {
        const { id } = jwt.verify(token, secret);
        const user = await User.findById(id);
        
        if (!user || !user.token) { 
            throw HttpError(401, "Not authorized"); 
        }   
        req.user = user;
    } catch (error) {
        if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
            throw HttpError(401, "Not authorized");
        }
        throw error;
    }

    next();
}

module.exports = {
       auth,
};