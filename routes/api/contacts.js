const express = require("express");
const router = express.Router();
const { validation, updateValidation } = require("../../validation");
const { contactsSchema, contactsUpdateSchema } = require("../../contactsSchema");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
} = require("../../controllers/contacts.controller");

router.get("/", async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.status(200).json({ contacts });
  } catch (error) {
    next(error);
  }
  });

router.get("/:contactId", async (req, res, next) => {
  try {
    const contact = await getContactById(req.params.contactId);

    if (!contact) {
      return res.status(404).json({message: "Not found"});
    }
    res.status(200).json({ contact });
  } catch (error) {
    next(error);
  }
  });

router.post("/", validation(contactsSchema), async (req, res, next) => {
  try {
    const { name, email, phone, favorite } = req.body;
      const contact = await addContact(name, email, phone, favorite);
      if (!contact) {
        return res.status(400).json({ message: "missing required name field"});
        }
    return res.json(contact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await removeContact(contactId);
    if (!contact) {
      return res.status(404).json({message: "Not found"})
    }
    res.status(200).json({ message: "contact deleted" });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", updateValidation(contactsUpdateSchema), async (req, res, next) => {
  try {
    const { contactId } = req.params;
    let { name, email, phone, favorite } = req.body; 
    if (favorite === undefined) {
      favorite = false;
    }
    const contact = await updateContact(contactId, name, email, phone, favorite );
    if (!contact) {
      return res.status(404).json({ message: "Not found"});
    }
    res.status(200).json( contact );
  } catch (error) {
    next(error);
  }
});

router.patch("/:contactId/favorite", updateValidation(contactsUpdateSchema), async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { favorite } = req.body;
    if (favorite === undefined) { 
      return res.status(400).json({ message: "missing field favorite" });
    }
    const contact = await updateStatusContact(contactId, favorite);
    if (!contact) {
      return res.status(404).json({ message: "Not found" });
    }
    res.status(200).json(contact);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
