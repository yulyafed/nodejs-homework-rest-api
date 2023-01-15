const { Contact } = require("../models/contacts");

async function listContacts(req, res) {
    const contacts = await Contact.find({});
    res.json(contacts);
}

async function getContactById(req, res, next) {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    return res.json(contact);
}

async function addContact(req, res, next) {
    const { name,email,phone,favorite } = req.body;
    const newContact = await Contact.create({
        name, email, phone, favorite,
    });
    res.status(201).json(newContact);
}

async function removeContact(req, res, next) {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    await Contact.findByIdAndRemove(id);
    return res.status(200).json(contact);
}

async function updateContact(req, res, next) {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    await Contact.findByIdAndUpdate(id);
    return res.status(200).json(contact);
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

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}