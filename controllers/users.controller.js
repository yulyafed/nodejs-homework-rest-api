const { User } = require("../models/users");

const currentUser = async (req, res) => {
    const user = await User.findOne({ _id: userId });
    if (!user) {
        throw HttpError(401, "Not authorized");
    }
    return res.status(200).json({
        email,
        subscription: user.subscription,
    });
};

module.exports = {
    currentUser,
};