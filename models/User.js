const { Schema, model } = require('mongoose');
const Joi = require('joi');

const { handleSaveError, runValidateUpdate } = require('./hooks');

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const userSchema = new Schema({
    password: {
        type: String,
        required: [true, 'Set password for user'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: emailRegexp,
        unique: true,
    },
    subscription: {
        type: String,
        enum: ["starter", "pro", "business"],
        default: "starter"
    },
    avatarURL: {
        type: String,
    },
    token: String,
    verify: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
        required: [true, 'Verify token is required'],
    },
}, { versionKey: false, timestamps: true });


userSchema.post("save", handleSaveError);

userSchema.post("findOneAndUpdate", handleSaveError);

const userSignupSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
})

const userSigninSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
})

const userEmailSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required()
})

const User = model("user", userSchema);

module.exports = { User, userSignupSchema, userSigninSchema, userEmailSchema };