import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";

import validateBody from "../helpers/validateBody.js";
import { cntrlWrapper } from "../helpers/cntrlWrapper.js";
import { isValidId } from "../helpers/isValidId.js";

import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.get("/", cntrlWrapper(getAllContacts));

contactsRouter.get("/:id", isValidId, cntrlWrapper(getOneContact));

contactsRouter.delete("/:id", isValidId, cntrlWrapper(deleteContact));

contactsRouter.post(
  "/",
  validateBody(createContactSchema),
  cntrlWrapper(createContact)
);

contactsRouter.put(
  "/:id",
  isValidId,
  validateBody(updateContactSchema),
  cntrlWrapper(updateContact)
);

contactsRouter.patch(
  "/:id/favorite",
  isValidId,
  validateBody(updateFavoriteSchema),
  cntrlWrapper(updateStatusContact)
);

export default contactsRouter;
