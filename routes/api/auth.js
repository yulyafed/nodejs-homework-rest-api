const express = require("express");

const { tryCatchWrapper } = require("../../helpers/index.js");
const { register, login, logout, currentUser } = require("../../controllers/auth.controller");
const { authValidation}   = require("../../validation");
const { authSchema } = require("../../contactsSchema/auth");
const { auth } = require("../../middlewares");

const authRouter = express.Router();

authRouter.post("/register", authValidation(authSchema), tryCatchWrapper(register));
authRouter.post("/login", authValidation(authSchema), tryCatchWrapper(login));
authRouter.post("/logout", tryCatchWrapper(auth), tryCatchWrapper(logout));
authRouter.get("/current", tryCatchWrapper(auth), tryCatchWrapper(currentUser),
);

module.exports = {
    authRouter,
};