const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    console.log("Formdan gelen email:", email);
    try {

        const resetLink = `http://localhost:5000/reset-password?email=${encodeURIComponent(email)}`;


        await transporter.sendMail({
            from: '"Destek" <dlarayksk6@gmail.com>',
            to: email,
            subject: "Şifre Sıfırlama",
            html: `<p>Şifrenizi sıfırlamak için <a href="${resetLink}">buraya tıklayın</a>.</p>`
        });

        res.send('Şifre sıfırlama e-postası gönderildi.');
    } catch (error) {
        console.error(error);
        res.status(500).send('E-posta gönderilirken bir hata oluştu.');
    }
});

module.exports = router;
