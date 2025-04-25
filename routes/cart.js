const express = require('express');
const router  = express.Router();
const jwt     = require('jsonwebtoken');
const Cart    = require('../models/Cart');
const { JWT_SECRET } = process.env;

// JWT doğrulama
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Token gerekli' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Geçersiz token' });
    req.user = decoded;
    next();
  });
};

// GET /api/cart → Sepeti getir (yoksa oluşturur)
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

// POST /api/cart/add → Sepete ürün ekle
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

// DELETE /api/cart/remove/:productId → Ürün çıkar
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

module.exports = router;