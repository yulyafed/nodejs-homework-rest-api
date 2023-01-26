const { Contact } = require("../models/contacts");

async function listContacts(owner) {
    const contacts = await Contact.find({owner: owner});
    return contacts;
}

async function getContactById(contactId) {
    const contact = await Contact.find(contactId);
    return contact;
}

async function addContact(owner, name, email, phone, favorite) {
       const newContact = await Contact.create({
           name, email, phone, favorite, owner,
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

async function uploadImage(req, res, next) {

    const { filename } = req.file;
    const tmpPath = path.resolve(__dirname, "../tmp", filename);
    const publicPath = path.resolve(__dirname, "../public", filename);
    try {
        await fs.rename(tmpPath, publicPath);
    } catch (error) {
        await fs.unlink(tmpPath);
        throw error;
    }

    const contactId = req.params.id;

    const contact = await Contact.findById(contactId);
    contact.image = `/public/${filename}`;
    await contact.save();

    return res.json({
        data: {
            image: contact.image,
        },
    });
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
    updateStatusContact,
    uploadImage,
}

