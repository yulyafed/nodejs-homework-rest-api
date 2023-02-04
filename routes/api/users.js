const express = require("express");
const { tryCatchWrapper } = require("../../helpers/index.js");
const { register, login, logout, currentUser, uploadAvatar, verifyEmail} = require("../../controllers/users.controller");
const { auth, upload } = require("../../middlewares");

const { authValidat }   = require("../../validation");
const { authSchema } = require("../../contactsSchema");

const usersRouter = express.Router();

usersRouter.post("/register", authValidat(authSchema), tryCatchWrapper(register));
usersRouter.post("/login", authValidat(authSchema), tryCatchWrapper(login));
usersRouter.post("/logout", tryCatchWrapper(auth), tryCatchWrapper(logout));
usersRouter.get("/current", tryCatchWrapper(auth), tryCatchWrapper(currentUser));
usersRouter.patch("/avatars", tryCatchWrapper(auth), upload.single("avatar"), tryCatchWrapper(uploadAvatar));
usersRouter.get("/verify/:verificationToken", tryCatchWrapper(verifyEmail));

// router.get("/verify/:verificationToken", asyncWrapper(verificationController));

// router.post("/verify", resendVerificationValidation, asyncWrapper(resendVerificationController));

module.exports = {
    usersRouter,
};