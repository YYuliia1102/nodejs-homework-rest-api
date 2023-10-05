const express = require('express');

const authController = require('../../controllers/auth-controller');

const userSchemas = require('../../models/User');

const { validateBody } = require('../../decorators/index');

const { authenticate, upload } = require('../../middleware/index');

const router = express.Router();

const userSignupValidate = validateBody(userSchemas.userSignupSchema);
const userSigninValidate = validateBody(userSchemas.userSigninSchema);
const userEmailValidate = validateBody(userSchemas.userEmailSchema);

router.post("/signup", upload.single("avatarURL"), userSignupValidate, authController.signup);

router.get("/verify/:verificationToken", authController.verify);

router.post("/verify", userEmailValidate, authController.resendVerityEmail);

router.post("/signin", userSigninValidate, authController.signin);

router.get("/current", authenticate, authController.getCurrent);

router.post("/logout", authenticate, authController.logout);

module.exports = router;