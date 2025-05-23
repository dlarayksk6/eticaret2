require('dotenv').config();
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const nodemailer = require('nodemailer');
const { JWT_SECRET } = process.env;


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token gerekli' });
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Geçersiz token' });
    req.user = decoded;
    next();
  });
};

router.post('/complete', authenticate, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Sepet boş' });
    }

    const order = await Order.create({
      userId: req.user.id,
      items: cart.items,
      totalPrice: cart.totalPrice
    });


    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.json({ message: 'Siparişiniz alındı', order });
  } catch (err) {
    res.status(500).json({ message: 'Sipariş hatası', error: err });
  }
});


router.get('/history', authenticate, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id });
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err });
  }
});

router.post('/order-completed', async (req, res) => {
  const { email } = req.body;
  try {
    await transporter.sendMail({
      from: '"Destek" <dlarayksk6@gmail.com>',
      to: email,
      subject: "Siparişiniz Başarıyla Alındı",
      html: `<p>Teşekkürler! Siparişiniz alınmıştır.</p>`
    });
    res.send('Sipariş onay maili gönderildi.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Sipariş maili gönderilirken hata oluştu.');
  }
});

module.exports = router;