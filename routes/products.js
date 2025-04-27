const express = require('express');
const router = express.Router();
const { Product } = require('../mongo');
const { authenticate, authorize } = require('../middleware/auth');

// Ürün ekle
router.post('/', authenticate, authorize('supplier'), async (req, res) => {
    try {
        const { name, description, price, stock } = req.body;
        const supplierId = req.user.id; // Token'dan geliyor

        const newProduct = new Product({
            name,
            description,
            price,
            stock,
            supplierId
        });

        await newProduct.save();
        res.status(201).json({ message: 'Ürün başarıyla eklendi', product: newProduct });
    } catch (err) {
        console.error('Ürün ekleme hatası:', err);
        res.status(500).json({ message: 'Ürün eklenirken bir hata oluştu', error: err.message });
    }
});

// Tüm ürünleri getir
router.get('/', authenticate, authorize('supplier'), async (req, res) => {
    try {
        const products = await Product.find({ supplierId: req.user.id, isDeleted: false });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Ürünler getirilirken hata oluştu', error: err.message });
    }
});

// Herkesin görebileceği: Tüm ürünleri getir
router.get('/all', async (req, res) => {
    try {
        const products = await Product.find({ isDeleted: false });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: 'Ürünler getirilirken hata oluştu', error: err.message });
    }
});

module.exports = router; 