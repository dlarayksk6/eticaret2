import nodemailer from 'nodemailer';

export async function handleForgotPassword(email) {
    if (!email) {
        return { ok: false, data: { message: 'Email gerekli' } };
    }

    const resetLink = `http://localhost:5000/reset-password?email=${encodeURIComponent(email)}`;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    try {
        await transporter.sendMail({
            from: '"Destek" <dlarayksk6@gmail.com>',
            to: email,
            subject: "Şifre Sıfırlama",
            html: `<p>Şifrenizi sıfırlamak için <a href="${resetLink}">buraya tıklayın</a>.</p>`
        });

        return { ok: true, data: { message: 'Şifre sıfırlama e-postası gönderildi.' } };
    } catch (error) {
        console.error(error);
        return { ok: false, data: { message: 'E-posta gönderilirken bir hata oluştu.' } };
    }
}
