const express = require('express');
const usersController = require('../../controllers/users-controller.js');

const { authenticate, upload } = require('../../middleware/index');

const router = express.Router();

router.use(authenticate);

router.patch("/avatars", upload.single("avatarURL"), usersController.updateAvatar);

module.exports = router;
