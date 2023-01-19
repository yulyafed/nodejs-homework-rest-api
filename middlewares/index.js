const jwt = require("jsonwebtoken");
const { User } = require("./../models/users");

const { JWT_SECRET } = process.env;

async function auth(req, res, next) {
    const authHeader = req.headers.authorization || "";
    const [type, token] = authHeader.split(" ");

    if (type !== "Bearer") {
        throw HttpError(401, "token type is not valid");
    }

    if (!token) {
        throw HttpError(401, "no token provided");
    }

    try {
        const { id } = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(id);
        req.user = user;
    } catch (error) {
        if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
            throw HttpError(401, "jwt token is not valid");
        }
        throw error;
    }

    next();
}

module.exports = {
       auth,
};