const bcrypt = require("bcrypt");
const { HttpError } = require("../helpers");
const jwt = require("jsonwebtoken");
const gravatar = require('gravatar');
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");
const { User } = require("../models/users");

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
        });
       
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

async function uploadAvatar(req, res, next) {

    const { filename } = req.file;
    const tmpPath = path.resolve(__dirname, "../tmp", filename);
    const publicPath = path.resolve(__dirname, "../public", filename);
    try {
        await fs.rename(tmpPath, publicPath);
    } catch (error) {
        await fs.unlink(tmpPath);
        throw error;
    }

    const { _id: userId } = req.user;

    const user = await User.findById(userId);
    user.avatarURL = `/public/avatars/${filename}`;
    await user.save();

    return res.json({
        data: {
            user: user.avatarURL,
        },
    });
}

// const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

// const updateAvatar = async (req, res) => {
//     const { path: tempUload, originalname } = req.file;
//     const { _id: id } = req.user;
//     const imageName = `${id}_${originalname}`;
//     try {
//         const resultUpload = path.join(avatarsDir, imageName);
//         await Jimp.read(tempUload)
//             .then((avatar) => {
//                 return avatar.resize(250, 250).quality(60).write(resultUpload);
//             })
//             .catch((error) => {
//                 throw error;
//             });
//         // await fs.rename(tempUload, resultUpload);
//         const avatarURL = path.join("public", "avatars", imageName);
//         await User.findByIdAndUpdate(req.user._id, { avatarURL });
//         res.json({ avatarURL });
//     } catch (error) {
//         await fs.unlink(tempUload);
//         throw error;
//     }
// };

module.exports = {
    register,
    login,
    logout,
    currentUser,
    uploadAvatar,
};