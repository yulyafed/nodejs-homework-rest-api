const { User } = require("../models/users");

async function addContact(req, res, next) {
    const { user } = req;
    const { id: contactId } = req.body;

    user.contacts.push({ _id: contactId });
    await User.findByIdAndUpdate(user._id, user);

    return res.status(201).json({
        data: {
            contacts: user.contacts,
        },
    });
}

async function getContacts(req, res, next) {
    const { user } = req;
    const userWithContacts = await User.findById(user._id);;

    return res.status(200).json({
        data: {
            contacts: userWithContacts.contacts,
        },
    });
}

async function me(req, res, next) {
    const { user } = req;
    const { email, _id: id } = user;

    return res.status(200).json({
        data: {
            user: {
                email,
                id,
            },
        },
    });
}

module.exports = {
    addContact,
    getContacts,
    me,
};