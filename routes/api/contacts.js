const express = require("express");
const router = express.Router();
const { ErrorHttp } = require("../../helpers/index.js");

const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("../../models/contacts");

const { validation } = require("../../middlewares");
const { contactSchema } = require("../../shema");

router.get("/", async (req, res, next) => {
  const contacts = await listContacts();
  res.status(200).json([ contacts ]);
});

router.get("/:contactId", async (req, res, next) => {
  const contact = await getContactById(req.params.contactId);

  if (!contact) {
    return next(ErrorHttp(404, "Not found"));
    // res.status(404).json("Not found"))
  }
  res.status(200).json({ contact });
});

router.post("/", validation(contactSchema), async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    const id = shortid.generate();
    
    if (error) {
      return next(ErrorHttp(400, "missing required name field"));
      // res.status(400).json("missing required name field"))
      
    }
    const contact = await addContact(req.body, res);
    res.status(201).json({ id, contact });
  } catch (error) {
    next(error);
  }
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await removeContact(contactId);
    if (!contact) {
      return next(ErrorHttp(404, "Not found"));
      // res.status(404).json({ "message": "Not found" })
    }
    res.status(200).json({ "message": "contact deleted"  });
  } catch (error) {
    next(error);
  }
});

router.put("/:contactId", validation(contactSchema), async (req, res, next) => {
  try {
    const { error } = contactSchema.validate(req.body);
    if (error) {
      return next(ErrorHttp(400, "missing fields"));
    }
    const { contactId } = req.params;
    const contact = await updateContact(contactId, req.body);
    if (!contact) {
      return next(ErrorHttp(404, "Not found"));
    }
    res.json({ contact, message: "put contact" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
