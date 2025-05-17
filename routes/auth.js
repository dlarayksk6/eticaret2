require('dotenv').config();

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const pool = require('../db');
const router = express.Router();
const { JWT_SECRET } = process.env;

router.post('/register', async (req, res) => {
    const { username, password, email, role } = req.body;
    console.log("Gelen veri:", req.body);
    if (!username || !password || !email || !role) {
        return res.status(400).json({ message: "Kullanıcı adı, şifre, email ve rol gereklidir" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            "INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)",
            [username, hashedPassword, email, role]
        );
        res.status(201).json({ message: "Kayıt başarılı" });
    } catch (err) {
        console.error("Kayıt hatası detay:", err);
        res.status(500).json({ message: "Kayıt hatası", error: err.message });
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log("Gelen login verisi:", req.body);

    if (!username || !password) {
        return res.status(400).json({ message: "Kullanıcı adı ve şifre gereklidir" });
    }

    try {
        const [rows] = await pool.query(
            "SELECT * FROM users WHERE username = ?",
            [username]
        );

        if (rows.length === 0) {
            return res.status(400).json({ message: "Kullanıcı bulunamadı" });
        }

        const user = rows[0];
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: "Geçersiz şifre" });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log("Giriş başarılı, kullanıcı verisi:", user);
        res.json({
            message: "Giriş başarılı",
            token,
            user: { id: user.id, username: user.username, role: user.role, email: user.email }
        });
    } catch (err) {
        console.error("Giriş hatası detay:", err);
        res.status(500).json({ message: "Giriş hatası", error: err.message });
    }
});

module.exports = router;
