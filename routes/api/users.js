const express = require("express");
const { tryCatchWrapper } = require("../../helpers/index.js");
const { currentUser} = require("../../controllers/users.controller");
const { auth } = require("../../middlewares");
const usersRouter = express.Router();

usersRouter.get("/current", tryCatchWrapper(auth), tryCatchWrapper(currentUser));

module.exports = {
    usersRouter,
};