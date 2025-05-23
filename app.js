require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectMongo } = require('./mongo');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const productRoutes = require('./routes/products');
const forgotPasswordRoute = require('./routes/forgotPassword');
const resetPasswordRoute = require('./routes/resetPassword');
const authRoute = require('./routes/auth');

const app = express();

connectMongo();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use('/api/auth', authRoute);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/products', productRoutes);

app.use('/', forgotPasswordRoute);
app.use('/', resetPasswordRoute);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

module.exports = app;  