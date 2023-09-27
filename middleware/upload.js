const multer = require('multer');
const path = require('path');

const destination = path.resolve('temp');

const storage = multer.diskStorage({
    destination,
    filename: (req, file, cb) => {
        const uniquePreffix = `${Date.now()}_${Math.round(Math.random() * 1E9)}`;
        const filename = `${uniquePreffix}_${file.originalname}`;
        cb(null, filename);
    }
})

const limits = {
    fileSize: 1050 * 1050 * 5
}

const upload = multer({
    storage,
    limits,
})

module.exports = upload;