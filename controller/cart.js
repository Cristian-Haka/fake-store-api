const Cart = require('../model/cart');

module.exports.getAllCarts = (req, res) => {
	const limit = Number(req.query.limit) || 0;
	const sort = req.query.sort == 'desc' ? -1 : 1;
	const startDate = req.query.startdate || new Date('1970-1-1');
	const endDate = req.query.enddate || new Date();

	console.log(startDate, endDate);

	Cart.find({
		date: { $gte: new Date(startDate), $lt: new Date(endDate) },
	})
		.select('-_id -products._id')
		.limit(limit)
		.sort({ id: sort })
		.then((carts) => {
			res.json(carts);
		})
		.catch((err) => console.log(err));
};

module.exports.getCartsbyUserid = (req, res) => {
	const userId = req.params.userid;
	const startDate = req.query.startdate || new Date('1970-1-1');
	const endDate = req.query.enddate || new Date();

	console.log(startDate, endDate);
	Cart.find({
		userId,
		date: { $gte: new Date(startDate), $lt: new Date(endDate) },
	})
		.select('-_id -products._id')
		.then((carts) => {
			res.json(carts);
		})
		.catch((err) => console.log(err));
};

module.exports.getSingleCart = (req, res) => {
	const id = req.params.id;
	Cart.findOne({
		id,
	})
		.select('-_id -products._id')
		.then((cart) => res.json(cart))
		.catch((err) => console.log(err));
};

module.exports.addCart = async (req, res) => {
        if (typeof req.body == undefined) {
                res.json({
                        status: 'error',
                        message: 'data is undefined',
                });
        } else {
                try {
                        const count = await Cart.countDocuments();
                        const cart = new Cart({
                                id: count + 1,
                                userId: req.body.userId,
                                date: req.body.date,
                                products: req.body.products,
                        });
                        const savedCart = await cart.save();
                        res.json(savedCart);
                } catch (err) {
                        console.log(err);
                }
        }
};

module.exports.editCart = async (req, res) => {
        if (typeof req.body == undefined || req.params.id == null) {
                res.json({
                        status: 'error',
                        message: 'something went wrong! check your sent data',
                });
        } else {
                try {
                        const cart = await Cart.findOne({ id: req.params.id });
                        if (!cart) {
                                return res.json({});
                        }
                        const updatedCart = await Cart.findByIdAndUpdate(
                                cart._id,
                                {
                                        userId: req.body.userId,
                                        date: req.body.date,
                                        products: req.body.products,
                                },
                                { new: true }
                        );
                        res.json(updatedCart);
                } catch (err) {
                        console.log(err);
                }
        }
};

module.exports.deleteCart = async (req, res) => {
        if (req.params.id == null) {
                res.json({
                        status: 'error',
                        message: 'cart id should be provided',
                });
        } else {
                try {
                        const cart = await Cart.findOne({ id: req.params.id });
                        if (!cart) {
                                return res.json(null);
                        }
                        const deletedCart = await Cart.findByIdAndDelete(cart._id);
                        res.json(deletedCart);
                } catch (err) {
                        console.log(err);
                }
        }
};
