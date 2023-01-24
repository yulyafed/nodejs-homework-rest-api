const { Contact } = require("../models/contacts");

async function listContacts() {
    const contacts = await Contact.find();
    return contacts;
}

async function getContactById(contactId) {
    const contact = await Contact.findById(contactId);
    return contact;
}

async function addContact(name, email, phone, favorite) {
       const newContact = await Contact.create({
           name, email, phone, favorite, 
    });
    return newContact;
}

async function removeContact(contactId) {
    const contact = await Contact.findByIdAndRemove(contactId);
    return contact;
}

async function updateContact(contactId, name, email, phone, favorite) {
    const contact = await Contact.findByIdAndUpdate(contactId, { name, email, phone, favorite });
    return contact;
}

async function updateStatusContact(contactId, favorite) {
    const contact = await Contact.findByIdAndUpdate(contactId, { favorite });
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

