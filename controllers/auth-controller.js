const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
const { HttpError } = require('../helpers/index');
const { ctrlWrapper } = require('../decorators/index');
const gravatar = require('gravatar');

require('dotenv').config();

const { JWT_SECRET } = process.env;


const signup = async (req, res) => {
    const { email, password } = req.body;
    const avatarURL = gravatar.url(email, { protocol: 'https', s: '100' });
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "Email already exist");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ ...req.body, avatarURL, password: hashPassword });

    res.status(201).json({
        // username: newUser.username,
        email: newUser.email,
    })
}

const signin = async (req, res) => {
    console.log(req);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {

        throw HttpError(401, "Email or password invalid");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!passwordCompare) {
        throw HttpError(401, "Email or password invalid");
    }

    const { _id: id } = user;

    const payload = {
        id,
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await User.findByIdAndUpdate(id, { token });

    res.json({
        token,
    })
}

const getCurrent = (req, res) => {
    const { email } = req.user;

    res.json({
        email
    })
}

const logout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(id, { token: "" });

    res.json({
        message: "Logout success"
    })
}

module.exports = {
    signup: ctrlWrapper(signup),
    signin: ctrlWrapper(signin),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout)
}
