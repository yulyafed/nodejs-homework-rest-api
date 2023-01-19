const bcrypt = require("bcrypt");
const { User } = require("../models/users");
const { HttpError } = require("../helpers");
const jwt = require("jsonwebtoken");

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

        res.status(201).json({
                user: {
                    email,
                    subscription: savedUser.subscription,
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
        throw new HttpError(401, "email is not valid");
    }

    const isPasswordValid = await bcrypt.compare(password, storedUser.password);

    if (!isPasswordValid) {
        throw new HttpError(401, "password is not valid");
    }

    const payload = { id: storedUser._id };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    return res.json({
        data: {
            token,
        },
    });
}

module.exports = {
    register,
    login,
};