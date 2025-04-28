const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dlarayksk6@gmail.com',
        pass: 'abcde'
    }
});


const sendCartUpdatedEmail = async (email) => {
    await transporter.sendMail({
        from: '"E-Ticaret Sistemi" <dlarayksk6@gmail.com>',
        to: email,
        subject: 'Sepetiniz Güncellendi',
        html: `
      <h2>Sepetiniz Güncellendi!</h2>
      <p>Sepetinize ürün eklendi veya değiştirildi.</p>
    `
    });
};


const sendOrderReceivedEmail = async (email) => {
    await transporter.sendMail({
        from: '"E-Ticaret Sistemi" <dlarayksk6@gmail.com>',
        to: email,
        subject: 'Siparişiniz Alındı',
        html: `
      <h2>Teşekkürler!</h2>
      <p>Siparişiniz başarıyla alındı. Güzel günlerde kullanmanız dileğiyle!</p>
    `
    });
};

module.exports = { sendCartUpdatedEmail, sendOrderReceivedEmail };
