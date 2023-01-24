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

// const fs = require("fs/promises");
// const path = require("path");
// const shortid = require('shortid');

// const listContacts = async () => {
//   const contactsRaw = await fs.readFile(Contact);
//   const contacts = JSON.parse(contactsRaw);
//   return contacts;
// }

// const writeContacts = async (contacts) => {
//     await fs.writeFile(Contact, JSON.stringify(contacts, null, 2));
// }

// const getContactById = async (contactId) => {
//   const contacts = await listContacts();
//   const updateContactById = contacts.find((contact) => contact.id === contactId);
//   return updateContactById || null;
// }

// const removeContact = async (contactId) => {
//   const contacts = await listContacts();
//   const updateContact = contacts.filter((contact) => contact.id !== contactId);
//   await writeContacts(updateContact);
//   return updateContact;
// }

// const addContact = async (body) => {
//   const id = shortid.generate();
//   const contact = { id, ...body };
//   const contacts = await listContacts();
//   contacts.push(contact);
//   await writeContacts(contacts);

//   return contact;
// }

// const updateContact = async (contactId, body) => {
//   const contacts = await listContacts();
//   const index = contacts.findIndex((contact) => contact.id === contactId);
//   if (index === -1) {
//     return false;
//   }
//   contacts.splice(index, 1, { id: contactId, ...body });
//   await writeContacts(contacts);
//   return contacts[index];
// }

