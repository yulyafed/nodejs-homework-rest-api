const express = require("express");

const { tryCatchWrapper } = require("../../helpers/index.js");
const { register, login, logout} = require("../../controllers/auth.controller");
const { authValidat}   = require("../../validation");
const { authSchema } = require("../../contactsSchema");
const { auth } = require("../../middlewares");

const authRouter = express.Router();

authRouter.post("/register", authValidat(authSchema), tryCatchWrapper(register));
authRouter.post("/login", authValidat(authSchema), tryCatchWrapper(login));
authRouter.post("/logout", tryCatchWrapper(auth), tryCatchWrapper(logout));


module.exports = {
    authRouter,
};