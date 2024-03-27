const User = require('../models/user');

const fetchUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.userId }).exec();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        console.log(req.body);
        const user = new User(req.body);
        console.log(user);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = { fetchUser, createUser };
