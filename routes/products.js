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

// Ürün güncelle
router.put('/:id', authenticate, authorize('supplier'), async (req, res) => {
    try {
        const { name, description, price, stock } = req.body;
        const product = await Product.findOne({ _id: req.params.id, supplierId: req.user.id });

        if (!product) {
            return res.status(404).json({ message: 'Ürün bulunamadı veya bu işlem için yetkiniz yok' });
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.stock = stock || product.stock;
        product.updatedAt = new Date();

        await product.save();
        res.json({ message: 'Ürün başarıyla güncellendi', product });
    } catch (err) {
        console.error('Ürün güncelleme hatası:', err);
        res.status(500).json({ message: 'Ürün güncellenirken bir hata oluştu', error: err.message });
    }
});

// Ürün sil (soft delete)
router.delete('/:id', authenticate, authorize('supplier'), async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id, supplierId: req.user.id });

        if (!product) {
            return res.status(404).json({ message: 'Ürün bulunamadı veya bu işlem için yetkiniz yok' });
        }

        product.isDeleted = true;
        product.updatedAt = new Date();
        await product.save();

        res.json({ message: 'Ürün başarıyla silindi' });
    } catch (err) {
        console.error('Ürün silme hatası:', err);
        res.status(500).json({ message: 'Ürün silinirken bir hata oluştu', error: err.message });
    }
});

module.exports = router; 