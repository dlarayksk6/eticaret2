
require('dotenv').config();

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Cart = require('../models/Cart');
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

router.get('/', authenticate, async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) {
      cart = await Cart.create({ userId: req.user.id, items: [], totalPrice: 0 });
    }
    res.json({ cart });
  } catch (err) {
    res.status(500).json({ message: 'Sunucu hatası', error: err });
  }
});


router.post('/add', authenticate, async (req, res) => {
  const { productId, name, price, quantity } = req.body;
  try {
    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) cart = new Cart({ userId: req.user.id, items: [], totalPrice: 0 });

    const existing = cart.items.find(i => i.productId === productId);
    if (existing) existing.quantity += quantity;
    else cart.items.push({ productId, name, price, quantity });

    cart.totalPrice = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    await cart.save();

    res.json({ message: 'Ürün sepete eklendi', cart });
  } catch (err) {
    res.status(500).json({ message: 'Ekleme hatası', error: err });
  }
});


router.delete('/remove/:productId', authenticate, async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(404).json({ message: 'Sepet bulunamadı' });

    cart.items = cart.items.filter(i => i.productId !== req.params.productId);
    cart.totalPrice = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    await cart.save();

    res.json({ message: 'Ürün çıkarıldı', cart });
  } catch (err) {
    res.status(500).json({ message: 'Çıkarma hatası', error: err });
  }
});

router.post('/cart-updated', async (req, res) => {
  const { email } = req.body;
  try {
    await transporter.sendMail({
      from: '"Destek" <dlarayksk6@gmail.com>',
      to: email,
      subject: "Sepetiniz Güncellendi",
      html: `<p>Sepetiniz başarıyla güncellendi. Hemen alışverişe devam edin!</p>`
    });
    res.send('Sepet güncelleme maili gönderildi.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Sepet maili gönderilirken hata oluştu.');
  }
});

module.exports = router;