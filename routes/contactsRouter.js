import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";

import { validateBody } from "../middlewares/validateBody.js";
import { isValidId } from "../middlewares/isValidId.js";
import { authenticate } from "../middlewares/authenticate.js";
import { cntrlWrapper } from "../helpers/cntrlWrapper.js";

import {
  createContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} from "../schemas/contactsSchemas.js";

const contactsRouter = express.Router();

contactsRouter.get("/", authenticate, cntrlWrapper(getAllContacts));

contactsRouter.get(
  "/:id",
  authenticate,
  isValidId,
  cntrlWrapper(getOneContact)
);

contactsRouter.delete(
  "/:id",
  authenticate,
  isValidId,
  cntrlWrapper(deleteContact)
);

contactsRouter.post(
  "/",
  authenticate,
  validateBody(createContactSchema),
  cntrlWrapper(createContact)
);

contactsRouter.put(
  "/:id",
  authenticate,
  isValidId,
  validateBody(updateContactSchema),
  cntrlWrapper(updateContact)
);

contactsRouter.patch(
  "/:id/favorite",
  authenticate,
  isValidId,
  validateBody(updateFavoriteSchema),
  cntrlWrapper(updateStatusContact)
);

export default contactsRouter;
