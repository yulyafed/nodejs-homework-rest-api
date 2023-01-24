const express = require("express");
const { tryCatchWrapper } = require("../../helpers/index.js");
const { register, login, logout, currentUser } = require("../../controllers/users.controller");
const { auth } = require("../../middlewares");

const { authValidat }   = require("../../validation");
const { authSchema } = require("../../contactsSchema");

const usersRouter = express.Router();

usersRouter.post("/register", authValidat(authSchema), tryCatchWrapper(register));
usersRouter.post("/login", authValidat(authSchema), tryCatchWrapper(login));
usersRouter.post("/logout", tryCatchWrapper(auth), tryCatchWrapper(logout));
usersRouter.get("/current", tryCatchWrapper(auth), tryCatchWrapper(currentUser));

module.exports = {
    usersRouter,
};