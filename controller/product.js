const Product = require('../model/product');

module.exports.getAllProducts = (req, res) => {
	const limit = Number(req.query.limit) || 0;
	const sort = req.query.sort == 'desc' ? -1 : 1;

	Product.find()
		.select(['-_id'])
		.limit(limit)
		.sort({ id: sort })
		.then((products) => {
			res.json(products);
		})
		.catch((err) => console.log(err));
};

module.exports.getProduct = (req, res) => {
	const id = req.params.id;

	Product.findOne({
		id,
	})
		.select(['-_id'])
		.then((product) => {
			res.json(product);
		})
		.catch((err) => console.log(err));
};

module.exports.getProductCategories = (req, res) => {
	Product.distinct('category')
		.then((categories) => {
			res.json(categories);
		})
		.catch((err) => console.log(err));
};

module.exports.getProductsInCategory = (req, res) => {
	const category = req.params.category;
	const limit = Number(req.query.limit) || 0;
	const sort = req.query.sort == 'desc' ? -1 : 1;

	Product.find({
		category,
	})
		.select(['-_id'])
		.limit(limit)
		.sort({ id: sort })
		.then((products) => {
			res.json(products);
		})
		.catch((err) => console.log(err));
};

module.exports.addProduct = async (req, res) => {
        if (typeof req.body == undefined) {
                res.json({
                        status: 'error',
                        message: 'data is undefined',
                });
        } else {
                try {
                        const count = await Product.countDocuments();
                        const product = new Product({
                                id: count + 1,
                                title: req.body.title,
                                price: req.body.price,
                                description: req.body.description,
                                image: req.body.image,
                                category: req.body.category,
                        });
                        const savedProduct = await product.save();
                        res.json(savedProduct);
                } catch (err) {
                        console.log(err);
                }
        }
};

module.exports.editProduct = async (req, res) => {
        if (typeof req.body == undefined || req.params.id == null) {
                res.json({
                        status: 'error',
                        message: 'something went wrong! check your sent data',
                });
        } else {
                try {
                        const product = await Product.findOne({ id: req.params.id });
                        if (!product) {
                                return res.json({});
                        }
                        const updatedProduct = await Product.findByIdAndUpdate(
                                product._id,
                                {
                                        title: req.body.title,
                                        price: req.body.price,
                                        description: req.body.description,
                                        image: req.body.image,
                                        category: req.body.category,
                                },
                                { new: true }
                        );
                        res.json(updatedProduct);
                } catch (err) {
                        console.log(err);
                }
        }
};

module.exports.deleteProduct = async (req, res) => {
        if (req.params.id == null) {
                res.json({
                        status: 'error',
                        message: 'cart id should be provided',
                });
        } else {
                try {
                        const product = await Product.findOne({ id: req.params.id });
                        if (!product) {
                                return res.json(null);
                        }
                        const deleted = await Product.findByIdAndDelete(product._id);
                        res.json(deleted);
                } catch (err) {
                        console.log(err);
                }
        }
};
