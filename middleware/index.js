const isValidId = require('../middleware/isValidId');

const authenticate = require('../middleware/authenticate');

const upload = require('../middleware/upload')

module.exports = { isValidId, authenticate, upload };