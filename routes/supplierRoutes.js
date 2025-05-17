const express = require('express');
const router = express.Router();
const { SupplierProfile } = require('../models/supplierProfile');
const { Product } = require('../config/mongodb');
const { authorize } = require('../middleware/auth');

router.post('/profile', authorize('supplier'), async (req, res) => {
    try {
        const {
            storeName,
            description,
            logo,
            address,
            phone,
            socialMedia
        } = req.body;

        let profile = await SupplierProfile.findOne({ userId: req.user.id });

        if (profile) {

            profile.storeName = storeName || profile.storeName;
            profile.description = description || profile.description;
            profile.logo = logo || profile.logo;
            profile.address = address || profile.address;
            profile.phone = phone || profile.phone;
            profile.socialMedia = socialMedia || profile.socialMedia;
            profile.updatedAt = new Date();
        } else {

            profile = new SupplierProfile({
                userId: req.user.id,
                storeName,
                description,
                logo,
                address,
                phone,
                socialMedia
            });
        }

        await profile.save();
        res.json({ message: "Profil başarıyla güncellendi", profile });
    } catch (err) {
        console.error('Profil güncelleme hatası:', err);
        res.status(500).json({ message: "Profil güncellenirken hata oluştu", error: err.message });
    }
});


router.get('/profile/:userId', async (req, res) => {
    try {
        const profile = await SupplierProfile.findOne({ userId: req.params.userId });
        if (!profile) {
            return res.status(404).json({ message: "Profil bulunamadı" });
        }


        const products = await Product.find({
            supplierId: req.params.userId,
            isDeleted: false
        });

        res.json({ profile, products });
    } catch (err) {
        console.error('Profil getirme hatası:', err);
        res.status(500).json({ message: "Profil getirilirken hata oluştu", error: err.message });
    }
});


router.get('/all', async (req, res) => {
    try {
        const suppliers = await SupplierProfile.find()
            .select('storeName description logo rating totalRatings isVerified');
        res.json(suppliers);
    } catch (err) {
        console.error('Tedarikçi listeleme hatası:', err);
        res.status(500).json({ message: "Tedarikçiler listelenirken hata oluştu", error: err.message });
    }
});

router.get('/stats', authorize('supplier'), async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments({
            supplierId: req.user.id,
            isDeleted: false
        });

        const profile = await SupplierProfile.findOne({ userId: req.user.id });

        res.json({
            totalProducts,
            rating: profile ? profile.rating : 0,
            totalRatings: profile ? profile.totalRatings : 0
        });
    } catch (err) {
        console.error('İstatistik getirme hatası:', err);
        res.status(500).json({ message: "İstatistikler getirilirken hata oluştu", error: err.message });
    }
});

module.exports = router; 