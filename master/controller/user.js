import User from "../models/user.js";

const fetchUser = async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.params.userId }).exec();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createUser = async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export { fetchUser, createUser };
