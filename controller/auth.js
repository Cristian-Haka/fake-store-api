const User = require('../model/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports.login = async (req, res) => {
        const username = req.body.username;
        const password = req.body.password;
        if (username && password) {
                try {
                        const user = await User.findOne({ username: username });
                        if (user && (await bcrypt.compare(password, user.password))) {
                                res.json({
                                        token: jwt.sign({ user: username }, process.env.JWT_SECRET),
                                });
                        } else {
                                res.status(401);
                                res.send('username or password is incorrect');
                        }
                } catch (err) {
                        console.error(err);
                }
        }
};
