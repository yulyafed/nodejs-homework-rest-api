const express = require("express");
const { tryCatchWrapper } = require("../../helpers/index.js");
const { addContact, getContacts, me } = require("../../controllers/users.controller");
const { auth } = require("../../middlewares");
const usersRouter = express.Router();

usersRouter.post("/contacts", tryCatchWrapper(auth), tryCatchWrapper(addContact));
usersRouter.get("/contacts", tryCatchWrapper(auth), tryCatchWrapper(getContacts));
usersRouter.get("/me", tryCatchWrapper(auth), tryCatchWrapper(me));

module.exports = {
    usersRouter,
};