const bcrypt = require("bcrypt");
const { HttpError } = require("../helpers");
const jwt = require("jsonwebtoken");
var gravatar = require('gravatar');

const { User } = require("../models/users");

const { JWT_SECRET } = process.env;

async function register(req, res, next) {
    
    const { email, password } = req.body;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

     
    try {
        const savedUser = await User.create({
            email,
            password: hashedPassword,
        });
        const avatarURL = gravatar.url(email);
        

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

    const payload = { id: storedUser._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "5h" });

    await User.findOneAndUpdate(storedUser._id, {token});
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

module.exports = {
    register,
    login,
    logout,
    currentUser
};