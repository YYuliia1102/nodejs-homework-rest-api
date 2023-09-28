const fs = require('fs/promises');

const { Contact, contactAddSchema } = require('../models/Contact');

const { HttpError } = require('../helpers/index');

const path = require('path');

const { ctrlWrapper } = require('../decorators/index');

const postersPath = path.resolve("public", "avatars");

const getAll = async (req, res) => {
    const { _id: owner } = req.user;
    const { page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;
    const result = await Contact.find({ owner: owner }, 'owner email', { skip, limit });
    res.json(result);
};

const getById = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findById(contactId);
    console.log('result', result);
    if (!result) {
        throw HttpError(404, "Contact with id=${contactId} not found");
    }
    res.json(result);
}

const add = async (req, res, user) => {
    const { _id: owner } = req.user;
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(postersPath, filename);
    await fs.rename(oldPath, newPath);
    const avatarURL = path.join("public", "avatars", filename);
    const newContact = new Contact({ ...req.body, avatarURL, owner });
    const result = await newContact.save()
    res.status(201).json(result);
}

const updateById = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });
    if (!result) {
        throw HttpError(404, "Contact with id=${contactId} not found");
    }
    res.json(result);
}

const deleteById = async (req, res) => {
    const { contactId } = req.params;
    const result = await Contact.findByIdAndDelete(contactId);
    if (!result) {
        throw HttpError(404, "Contact with id=${contactId} not found");
    }
    res.status(200).json({
        message: "Contact deleted"
    });
}

module.exports = {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    add: ctrlWrapper(add),
    updateById: ctrlWrapper(updateById),
    deleteById: ctrlWrapper(deleteById),
}