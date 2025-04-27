const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Kullanıcı Kaydı
router.post('/register', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Kullanıcı adı veya email kontrolü
        let user = await User.findOne({ $or: [{ username }, { email }] });
        if (user) {
            return res.status(400).json({ message: 'Bu kullanıcı adı veya email zaten kullanımda' });
        }

        // Yeni kullanıcı oluştur
        user = new User({
            username,
            email,
            password,
            role: role || 'user' // Rol belirtilmemişse varsayılan olarak 'user'
        });

        // Şifreyi hashle
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // JWT token oluştur
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

// Kullanıcı Girişi
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Kullanıcıyı bul
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
        }

        // Şifreyi kontrol et
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Geçersiz kullanıcı adı veya şifre' });
        }

        // JWT token oluştur
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Sunucu hatası' });
    }
});

module.exports = router; 