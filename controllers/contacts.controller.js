const { Contact } = require("../models/contacts");

async function listContacts(owner) {
    const contacts = await Contact.find(owner);
    return contacts;
}

async function getContactById(contactId, owner) {
    const contact = await Contact.findById(contactId, owner);
    return contact;
}

async function addContact(name, email, phone, favorite,owner) {
       const newContact = await Contact.create({
           name, email, phone, favorite ,owner
    });
    return newContact;
}

async function removeContact(contactId, owner) {
    const contact = await Contact.findByIdAndRemove(contactId, owner);
    return contact;
}

async function updateContact(contactId, name, email, phone, favorite, owner) {
    const contact = await Contact.findByIdAndUpdate(contactId, owner, { name, email, phone, favorite });
    return contact;
}

async function updateStatusContact(contactId, favorite, owner) {
    const contact = await Contact.findByIdAndUpdate(contactId, owner, { favorite });
    return contact;
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
    updateStatusContact,
}

