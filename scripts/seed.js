const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const bcrypt = require('bcrypt');

const Product = require('../model/product');
const Cart = require('../model/cart');
const User = require('../model/user');

const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

const products = [
  { id: 1, title: 'Gold Ring', price: 100, description: 'Simple gold ring', image: '', category: 'jewelery' },
  { id: 2, title: 'Headphones', price: 50, description: 'Noise cancelling headphones', image: '', category: 'electronics' },
  { id: 3, title: 'Men T-Shirt', price: 20, description: 'Cotton T-Shirt', image: '', category: "men's clothing" },
  { id: 4, title: 'Women Bag', price: 80, description: 'Leather handbag', image: '', category: "women's clothing" }
];

const users = [
  {
    id: 1,
    email: 'john@example.com',
    username: 'johnd',
    password: 'password',
    name: { firstname: 'John', lastname: 'Doe' },
    address: {
      city: 'kilcoole',
      street: '7835 new road',
      number: 3,
      zipcode: '12926-3874',
      geolocation: { lat: '-37.3159', long: '81.1496' }
    },
    phone: '1-570-236-7033'
  },
  {
    id: 2,
    email: 'mary@example.com',
    username: 'mary',
    password: 'password',
    name: { firstname: 'Mary', lastname: 'Doe' },
    address: {
      city: 'kilcoole',
      street: 'Larch Street',
      number: 5,
      zipcode: '12926-3874',
      geolocation: { lat: '-37.3159', long: '81.1496' }
    },
    phone: '1-570-236-7034'
  },
  {
    id: 3,
    email: 'tom@example.com',
    username: 'tom',
    password: 'password',
    name: { firstname: 'Tom', lastname: 'Smith' },
    address: {
      city: 'kilcoole',
      street: 'Main Street',
      number: 7,
      zipcode: '12926-3874',
      geolocation: { lat: '-37.3159', long: '81.1496' }
    },
    phone: '1-570-236-7035'
  }
];

const carts = [
  {
    id: 1,
    userId: 1,
    date: new Date('2020-02-20'),
    products: [
      { productId: 1, quantity: 2 },
      { productId: 2, quantity: 1 }
    ]
  },
  {
    id: 2,
    userId: 2,
    date: new Date('2020-03-15'),
    products: [
      { productId: 3, quantity: 1 }
    ]
  },
  {
    id: 3,
    userId: 1,
    date: new Date('2020-08-10'),
    products: [
      { productId: 2, quantity: 4 },
      { productId: 4, quantity: 2 }
    ]
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    for (const user of users) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    await Product.deleteMany({});
    await Cart.deleteMany({});
    await User.deleteMany({});

    await Product.insertMany(products);
    await User.insertMany(users);
    await Cart.insertMany(carts);

    console.log('Database seeded');
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
