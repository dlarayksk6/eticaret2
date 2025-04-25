const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const JWT_SECRET = process.env.JWT_SECRET;


app.get("/login.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.post('/register', async (req, res) => {
    const { username, password, email, role } = req.body;
    console.log("Gelen veri:", req.body);
    if (!username || !password || !email || !role) {
        return res.status(400).json({ message: "Kullanıcı adı,şifre ve email gereklidir" });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
            "INSERT INTO users (username, password,email,role) VALUES (?, ? ,?,?) ",
            [username, hashedPassword, email, role]
        );

        res.status(201).json({ message: "Kayıt başarılı" });

    } catch (err) {
        console.error("Kayıt hatası detay:", err);
        res.status(500).json({ message: "Kayıt hatası", error: err.message });
    }


});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    console.log("Gelen login verisi:", req.body);

    if (!username || !password) {
        return res.status(400).json({ message: "Kullanıcı adı, şifre gereklidir" });
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
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );


        console.log("Giriş başarılı, kullanıcı verisi:", user);
        res.json({
            message: "Giriş başarılı",
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });

    } catch (err) {
        console.error("Giriş hatası detay:", err);
        res.status(500).json({ message: "Giriş hatası", error: err.message });
    }
});


app.get('/protected', (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: "Token gerekli" });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Geçersiz veya süresi dolmuş token" });
        }
        res.json({ message: "Token geçerli", user: decoded });
    });
});


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor!`);
});
