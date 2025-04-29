const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const path = require('path');
const pool = require('../db')


router.post('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;

    console.log("Gelen email:", email);
    console.log("Yeni şifre:", newPassword);

    if (!email || !newPassword) {
        return res.status(400).send("Email ve yeni şifre gerekli");
    }

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        const [rows] = await pool.query("UPDATE users SET password = ? WHERE email = ?", [hashedPassword, email]);

        if (rows.affectedRows === 0) {
            return res.status(404).send("Bu email ile kullanıcı bulunamadı.");
        }

        return res.send("Şifre başarıyla güncellendi.");
    } catch (err) {
        console.error(err);
        return res.status(500).send("Şifre güncellenirken hata oluştu.");
    }
});



router.get('/reset-password', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/resetpassword.html'));
});



module.exports = router;
