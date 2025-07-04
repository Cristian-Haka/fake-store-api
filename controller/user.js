const User = require('../model/user');

module.exports.getAllUser = (req, res) => {
	const limit = Number(req.query.limit) || 0;
	const sort = req.query.sort == 'desc' ? -1 : 1;

	User.find()
		.select(['-_id'])
		.limit(limit)
		.sort({
			id: sort,
		})
		.then((users) => {
			res.json(users);
		})
		.catch((err) => console.log(err));
};

module.exports.getUser = (req, res) => {
	const id = req.params.id;

	User.findOne({
		id,
	})
		.select(['-_id'])
		.then((user) => {
			res.json(user);
		})
		.catch((err) => console.log(err));
};

module.exports.addUser = async (req, res) => {
        if (typeof req.body == undefined) {
                res.json({
                        status: 'error',
                        message: 'data is undefined',
                });
        } else {
                try {
                        const count = await User.countDocuments();
                        const user = new User({
                                id: count + 1,
                                email: req.body.email,
                                username: req.body.username,
                                password: req.body.password,
                                name: {
                                        firstname: req.body.firstname,
                                        lastname: req.body.lastname,
                                },
                                address: {
                                        city: req.body.address.city,
                                        street: req.body.address.street,
                                        number: req.body.number,
                                        zipcode: req.body.zipcode,
                                        geolocation: {
                                                lat: req.body.address.geolocation.lat,
                                                long: req.body.address.geolocation.long,
                                        },
                                },
                                phone: req.body.phone,
                        });
                        const savedUser = await user.save();
                        res.json(savedUser);
                } catch (err) {
                        console.log(err);
                }
        }
};

module.exports.editUser = async (req, res) => {
        if (typeof req.body == undefined || req.params.id == null) {
                res.json({
                        status: 'error',
                        message: 'something went wrong! check your sent data',
                });
        } else {
                try {
                        const user = await User.findOne({ id: req.params.id });
                        if (!user) {
                                return res.json({});
                        }
                        const updatedUser = await User.findByIdAndUpdate(
                                user._id,
                                {
                                        email: req.body.email,
                                        username: req.body.username,
                                        password: req.body.password,
                                        name: {
                                                firstname: req.body.firstname,
                                                lastname: req.body.lastname,
                                        },
                                        address: {
                                                city: req.body.address.city,
                                                street: req.body.address.street,
                                                number: req.body.number,
                                                zipcode: req.body.zipcode,
                                                geolocation: {
                                                        lat: req.body.address.geolocation.lat,
                                                        long: req.body.address.geolocation.long,
                                                },
                                        },
                                        phone: req.body.phone,
                                },
                                { new: true }
                        );
                        res.json(updatedUser);
                } catch (err) {
                        console.log(err);
                }
        }
};

module.exports.deleteUser = async (req, res) => {
        if (req.params.id == null) {
                res.json({
                        status: 'error',
                        message: 'cart id should be provided',
                });
        } else {
                try {
                        const user = await User.findOne({ id: req.params.id });
                        if (!user) {
                                return res.json(null);
                        }
                        const deletedUser = await User.findByIdAndDelete(user._id);
                        res.json(deletedUser);
                } catch (err) {
                        console.log(err);
                }
        }
};
