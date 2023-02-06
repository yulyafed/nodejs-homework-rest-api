const bcrypt = require("bcrypt");
const { HttpError } = require("../helpers");
const jwt = require("jsonwebtoken");
const gravatar = require('gravatar');
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const shortid = require('shortid');
const { v4: uuidv4 } = require('uuid');
const { User } = require("../models/users");
const { sendEmail} = require('../middlewares')

const { JWT_SECRET } = process.env;

async function register(req, res, next) {

    const { email, password } = req.body;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
        const avatarURL = gravatar.url(email);
        const savedUser = await User.create({
            email,
            password: hashedPassword,
            avatarURL,
            verificationToken: uuidv4(),
        });
 
        sendEmail(savedUser.email,savedUser.verificationToken);

        res.status(201).json({
            user: {
                email,
                subscription: savedUser.subscription,
                avatarURL,
            },
        });
    } catch (error) {
        if (error.message.includes("E11000 duplicate key error")) {
            throw new HttpError(409, "Email in use");
        }

        throw error;
    }
}

async function login(req, res, next) {
    const { email, password } = req.body;

    const storedUser = await User.findOne({
        email,
    });

    if (!storedUser) {
        throw new HttpError(401, "Email is wrong");
    }

    const isPasswordValid = await bcrypt.compare(password, storedUser.password);
    if (!isPasswordValid) {
        throw new HttpError(401, "password is wrong");
    }

    if (!storedUser.verify) {
        throw new HttpError(401, "not verified");
    }

    const payload = { id: storedUser._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5h" });

    await User.findOneAndUpdate(storedUser._id, { token });
    return res.json({
        token,
        user: {
            email,
            subscription: storedUser.subscription,
        },
    });
}

async function logout(req, res, next) {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: null });
    return res.status(204).json();
};

const currentUser = async (req, res) => {
    return res.status(200).json(req.user);
};

async function uploadAvatar(req, res, next) {
    
    const { filename } = req.file;
    const filepath = path.resolve("tmp", filename)

    const { _id: userId } = req.user;
    const publicFilepath = path.resolve("public/avatars", userId + "_" + filename)

    await Jimp.read(filepath)
        .then((avatar) => {
            return avatar.resize(250, 250).write(publicFilepath);
        })
        .catch((error) => {
            throw error;
        });
    await fs.unlink(filepath);

    const user = await User.findById(userId);
    user.avatarURL = "/avatars/" + userId + "_" + filename;
    await user.save();

    return res.json({
        data: {
            user: user.avatarURL,
        },
    });
}

const verifyUser = async (verificationToken) => {
    const user = await User.findOne({ verificationToken, verify: false });
    if (!user) {
        throw new HttpError(404, "User not found");
    }
    user.verificationToken = "null";
    user.verify = true;
    await user.save();
};

const verifyEmail = async (req, res) => {
    const { verificationToken } = req.params;
    await verifyUser(verificationToken);
    res.status(200).json({ status: "Verification successful" });
};

const resendVerification = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new HttpError(400, "User not found");
    }
    if (user.verify) {
        throw new HttpError(400, "Verification has already been passed");
    }

    sendMail(email, user.verificationToken);
};

const resendVerificationEmail = async (req, res) => {
    await resendVerification(req.body.email);
    res.json({ message: "Email sent" });
};

module.exports = {
    register,
    login,
    logout,
    currentUser,
    uploadAvatar,
    verifyEmail,
    resendVerificationEmail,
};




