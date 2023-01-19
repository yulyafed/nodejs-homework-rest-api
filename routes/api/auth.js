const express = require("express");

const { tryCatchWrapper } = require("../../helpers/index.js");
const { register, login } = require("../../controllers/auth.controller");
const { authValidation}   = require("../../validation");
const { authSchema } = require("../../contactsSchema");

const authRouter = express.Router();

authRouter.post("/register", authValidation(authSchema), tryCatchWrapper(register));
authRouter.post("/login", authValidation(authSchema), tryCatchWrapper(login));

module.exports = {
    authRouter,
};