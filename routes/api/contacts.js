const express = require("express");
const router = express.Router();
const { validation, updateValidation } = require("../../validation");
const { contactSchema, contactsUpdateSchema } = require("../../contactsSchema");
const { auth } = require("../../middlewares");
const { tryCatchWrapper } = require("../../helpers/index.js");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
  updateStatusContact,
  } = require("../../controllers/contacts.controller");

router.get("/", tryCatchWrapper(auth), async (req, res, next) => {
  try {
    const contacts = await listContacts(req.user._id);
    res.status(200).json({ contacts });
  } catch (error) {
    next(error);
  }
  });

router.get("/:contactId", tryCatchWrapper(auth), async (req, res, next) => {
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

router.post("/", tryCatchWrapper(auth), validation(contactSchema), async (req, res, next) => {
  try {
    const { name, email, phone, favorite } = req.body;
      const contact = await addContact(req.user._id, name, email, phone, favorite);
      if (!contact) {
        return res.status(400).json({ message: "missing required name field"});
        }
    return res.json(contact);
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", tryCatchWrapper(auth), async (req, res, next) => {
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

router.put("/:contactId", tryCatchWrapper(auth), updateValidation(contactsUpdateSchema), async (req, res, next) => {
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

router.patch("/:contactId/favorite", tryCatchWrapper(auth), updateValidation(contactsUpdateSchema), async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const { favorite } = req.body;
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
