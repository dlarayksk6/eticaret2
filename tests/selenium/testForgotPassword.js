const { Builder, By, until } = require('selenium-webdriver');

(async function forgotPasswordFlowTest() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {

        await driver.get('http://localhost:5000/login.html');


        const forgotButton = await driver.findElement(By.id('passwordButton'));
        await forgotButton.click();


        await driver.wait(until.urlContains('forgotpassword.html'), 5000);


        const emailInput = await driver.wait(until.elementLocated(By.css('input[name="email"]')), 5000);
        await driver.wait(until.elementIsVisible(emailInput), 5000);
        await emailInput.sendKeys('supplier1@example.com');


        const submitButton = await driver.findElement(By.css('button[type="submit"]'));
        await submitButton.click();


        await driver.wait(until.elementLocated(By.tagName('body')), 5000);
        const bodyText = await driver.findElement(By.tagName('body')).getText();

        if (bodyText.includes('Şifre sıfırlama e-postası gönderildi')) {
            console.log('Şifre sıfırlama akışı testi başarılı.');


            await driver.get('http://localhost:5000/resetpassword.html?email=supplier1@example.com');

            const newPasswordInput = await driver.findElement(By.id('newPassword'));
            await driver.wait(until.elementIsVisible(newPasswordInput), 5000);
            await newPasswordInput.sendKeys('123456');


            const submitButton1 = await driver.findElement(By.css('button[type="submit"]'));
            await submitButton1.click();
            console.log('Yeni şifre ayarlandı.');


            console.log('Test Başarılı.');

        } else if (bodyText.includes('E-posta gönderilirken bir hata oluştu')) {
            console.error('Backend hata mesajı geldi.');
        } else {
            console.error('Beklenen mesaj bulunamadı, test başarısız.');
        }

    } catch (error) {
        console.error('Test sırasında hata oluştu:', error);
    } finally {
        await driver.quit();
    }
})();
