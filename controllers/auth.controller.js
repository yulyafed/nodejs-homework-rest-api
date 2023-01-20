const bcrypt = require("bcrypt");
const { User } = require("../models/users");
const { HttpError } = require("../helpers");
const jwt = require("jsonwebtoken");

const secret = `${ process.env.JWT_SECRET }`;

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
        throw new HttpError(401, "Email is wrong");
    }

    const isPasswordValid = await bcrypt.compare(password, storedUser.password);

    if (!isPasswordValid) {
        throw new HttpError(401, "password is wrong");
    }

    const payload = { id: storedUser._id };
    const token = jwt.sign(payload, secret, { expiresIn: "5h" });

    return res.json({
        token,
        user: {
            email,
            subscription: storedUser.subscription,
        },
    });
}

async function logout(req, res, next) {
    const payload = { id: storedByIdUser.userId };
    const deletedToken = await User.remove({ token })
    return res.status(204).json({
        user: {
            token: deletedToken.token,
        },
    })
}

module.exports = {
    register,
    login,
    logout,
};