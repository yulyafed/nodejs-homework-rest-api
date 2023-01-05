const express = require("express");
const router = express.Router();
const { validation } = require("../../validation");
const { contactsSchema } = require("../../contactsSchema");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");

router.get("/", async (_, res, __) => {
  try {
    const contacts = await listContacts();
    res.status(200).json({ contacts });
  } catch (error) {
    next(error);
  }
  });

router.get("/:contactId", async (req, res, __) => {
  try {
    const contact = await getContactById(req.params.contactId);

    if (!contact) {
      return res.status(404).json("Not found");
    }
    res.status(200).json({ contact });
  } catch (error) {
    next(error);
  }
  });

router.post("/", validation(contactsSchema), async (req, res, next) => {
  try {
    const contact = await addContact(req.body);
    res.json(contact);
    if (contact) {
      return res.status(400).json("missing required name field");
    }
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await removeContact(contactId);
    if (!contact) {
      return res.status(404).json("Not found")
    }
    res.status(200).json("contact deleted");
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", validation(contactsSchema), async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await updateContact(contactId, req.body);
    if (!contact) {
      return res.status(404).json("Not found");
    }
    res.status(200).json( contact );
  } catch (error) {
    next(error);
  }
});

module.exports = router;
