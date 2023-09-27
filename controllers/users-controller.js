const fs = require('fs/promises');
const Jimp = require("jimp");
const { User } = require('../models/User');
const path = require('path');

const { ctrlWrapper } = require('../decorators/index');
const postersPath = path.resolve("public", "avatars");

const updateAvatar = async (req, res) => {

    const { _id: id } = req.user;
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(postersPath, filename);
    Jimp.read(oldPath, (err, file) => {
        if (err) throw err;
        file
            .resize(250, 250) // resize
            .quality(60) // set JPEG quality
            .write(newPath); // save
    });
    await fs.unlink(oldPath);
    const avatarURL = path.join("public", "avatars", filename);

    const result = await User.findByIdAndUpdate(id, { avatarURL });
    if (!result) {
        throw HttpError(404, "Contact with id=${contactId} not found");
    }
    res.json({ avatarURL })

}

module.exports = {
    updateAvatar: ctrlWrapper(updateAvatar)
}
