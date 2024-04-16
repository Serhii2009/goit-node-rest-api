import HttpError from "../helpers/HttpError.js";
import { Contact } from "../models/contactsModel.js";

export const getAllContacts = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 20, favorite = null } = req.query;
  const skip = (page - 1) * limit;
  const filters = { owner };

  if (favorite !== null) {
    filters.favorite = favorite;
  }

  const result = await Contact.find(filters, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "email subscription");
  res.status(200).json(result);
};

export const getOneContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const result = await Contact.findOne({ owner, _id: id });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

export const deleteContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const result = await Contact.findByIdAndDelete({ owner, _id: id });
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

export const createContact = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

export const updateContact = async (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw HttpError(400, "Body must have at least one field");
  }

  const { _id: owner } = req.user;
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(
    id,
    { ...req.body, owner },
    { new: true }
  );
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

export const updateStatusContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const result = await Contact.findByIdAndUpdate(
    id,
    { ...req.body, owner },
    { new: true }
  );
  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};
