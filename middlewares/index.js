const sgEmail = require("@sendgrid/mail");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const { HttpError} = require('../helpers')
const { User } = require("./../models/users");
const multer = require("multer");
const path = require("path");

dotenv.config();

const { JWT_SECRET } = process.env;
sgEmail.setApiKey(process.env.SENDGRID_API_KEY);

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
        const { id } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(id);
        if (!user || !user.token || user.token !== token) { 
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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve( "tmp"));
    },
    filename: function (req, file, cb) {
        cb(null,file.originalname);
    },
});

const upload = multer({
    storage,
    
});

async function sendEmail(email, verificationToken) {
    const msg = {
        to: email,
        from: "YulyaFed86@gmail.com",
        subject: "Thank you for your registration",
        text: `Please, confirm your email address http://localhost:3001/users/verify/${verificationToken}`,
        html: `Please, <a href="http://localhost:3001/users/verify/${verificationToken}">confirm</a> your email address`,
    }
    try {
        await sgEmail.send(msg);
        console.log("email has been sent");
    } catch (error) {
        console.error(error);
    }
};

module.exports = {
    auth,
    upload,
    sendEmail,
    
};