require('dotenv').config();

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const pool = require('./db');
const { connectMongo } = require('./mongo');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const path = require('path');
const productRoutes = require('./routes/products');
const forgotPasswordRoute = require('./routes/forgotPassword');
const resetPasswordRoute = require('./routes/resetPassword');


const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

connectMongo();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));   ////

app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/products', productRoutes);
app.use(express.static('public'));


app.get("/login.html", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.post('/register', async (req, res) => {
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

app.post('/login', async (req, res) => {
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

app.get('/protected', (req, res) => {
    const token = req.headers['authorization']?.split(' ')[1];
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



app.use('/', forgotPasswordRoute);
app.use('/', resetPasswordRoute);
app.use('/api/cart', cartRoutes);

app.use('/api/order', orderRoutes);
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "register.html"));
});

// ─── Sunucuyu başlat ─────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor!`);
});
