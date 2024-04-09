import HttpError from "../helpers/HttpError.js";
import { Contact } from "../models/contactsModel.js";

export const getAllContacts = async (req, res) => {
  const result = await Contact.find();
  res.status(200).json(result);
};

export const getOneContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findOne({ _id: id });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

export const deleteContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndDelete(id);
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

export const createContact = async (req, res) => {
  const result = await Contact.create(req.body);
  res.status(201).json(result);
};

export const updateContact = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw HttpError(400, "Body must have at least one field");
  }

  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

export const updateStatusContact = async (req, res) => {
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(id, req.body, { new: true });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

// import {
//   listContacts,
//   getContactById,
//   removeContact,
//   addContact,
//   editContact,
// } from "../services/contactsServices.js";
// import HttpError from "../helpers/HttpError.js";

// export const getAllContacts = async (req, res, next) => {
//   try {
//     const result = await listContacts();
//     res.status(200).json(result);
//   } catch (error) {
//     next(error);
//   }
// };

// export const getOneContact = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const result = await getContactById(id);
//     if (!result) {
//       throw HttpError(404, "Not found");
//     }
//     res.status(200).json(result);
//   } catch (error) {
//     next(error);
//   }
// };

// export const deleteContact = async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const result = await removeContact(id);
//     if (!result) {
//       throw HttpError(404, "Not found");
//     }
//     res.status(200).json(result);
//   } catch (error) {
//     next(error);
//   }
// };

// export const createContact = async (req, res, next) => {
//   try {
//     const result = await addContact(req.body);
//     res.status(201).json(result);
//   } catch (error) {
//     next(error);
//   }
// };

// export const updateContact = async (req, res, next) => {
//   try {
//     if (!req.body || Object.keys(req.body).length === 0) {
//       throw HttpError(400, "Body must have at least one field");
//     }

//     const { id } = req.params;
//     const result = await editContact(id, req.body);
//     if (!result) {
//       throw HttpError(404, "Not found");
//     }
//     res.status(200).json(result);
//   } catch (error) {
//     next(error);
//   }
// };
