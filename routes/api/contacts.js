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
  const contacts = await listContacts();
  res.status(200).json({ contacts });
});

router.get("/:contactId", async (req, res, next) => {
  const contact = await getContactById(req.params.contactId);

  if (!contact) {
    // return next(ErrorHttp(404, "Not found"));
    return res.status(404).json("Not found");
  }
   res.status(200).json({ contact });
});

router.post("/", validation(contactsSchema), async (req, res, next) => {
  try {
    const { error } = contactsSchema.validate(req.body);
    const { name, email, phone } = req.body;
    const id = shortid.generate();
    
    if (error) {
      // return next(ErrorHttp(400, "missing required name field"));
      return res.status(400).json("missing required name field")
      
    }
    const contact = await addContact(name, email, phone, res);
    res.json({ id, contact });
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await removeContact(contactId);
    if (!contact) {
      // return next(ErrorHttp(404, "Not found"));
       return res.status(404).json("Not found")
    }
    res.status(200).json("contact deleted");
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", validation(contactsSchema), async (req, res, next) => {
  try {
    const { error } = contactsSchema.validate(req.body);
    const { name, email, phone } = req.body;
    if (error) {
      return res.status(400).json("missing fields");
    }
    const { contactId } = req.params;
    const contact = await updateContact(contactId, name, email, phone);
    if (!contact) {
      return res.status(404).json("Not found");
    }
    res.status(200).json( contact, "update your contacts" );
  } catch (error) {
    next(error);
  }
});

module.exports = router;
