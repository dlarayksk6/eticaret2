const express = require('express');
const { handleForgotPassword } = require('../public/forgotPassword');

const router = express.Router();

router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    console.log("Formdan gelen email:", email);

    const result = await handleForgotPassword(email);

    if (result.ok) {
        return res.status(200).send(result.data.message);
    } else {
        return res.status(500).send(result.data.message);
    }
});

module.exports = router;
