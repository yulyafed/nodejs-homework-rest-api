const express = require("express");
const { tryCatchWrapper } = require("../../helpers/index.js");
const { register, login, logout, currentUser, uploadAvatar, verifyEmail, resendVerificationEmail} = require("../../controllers/users.controller");
const { auth, upload } = require("../../middlewares");

const { authValidat, userValidation }   = require("../../validation");
const { authSchema, userSchema } = require("../../contactsSchema");

const usersRouter = express.Router();

usersRouter.post("/register", authValidat(authSchema), tryCatchWrapper(register));
usersRouter.post("/login", authValidat(authSchema), tryCatchWrapper(login));
usersRouter.post("/logout", tryCatchWrapper(auth), tryCatchWrapper(logout));
usersRouter.get("/current", tryCatchWrapper(auth), tryCatchWrapper(currentUser));
usersRouter.patch("/avatars", tryCatchWrapper(auth), upload.single("avatar"), tryCatchWrapper(uploadAvatar));
usersRouter.get("/verify/:verificationToken", tryCatchWrapper(verifyEmail));
usersRouter.post("/verify", userValidation(userSchema), tryCatchWrapper(resendVerificationEmail));

module.exports = {
    usersRouter,
};