const { Builder, By, until } = require('selenium-webdriver');

(async function testSupplierRegistrationAndLogin() {
    console.log('Test başladı...');
    let driver = await new Builder().forBrowser('chrome').build();

    try {

        await driver.get('http://localhost:5000/register.html');
        console.log('Kayıt sayfası açıldı');


        await driver.findElement(By.id('username')).sendKeys('suppliertest11');
        await driver.findElement(By.id('email')).sendKeys('supplier11@example.com');
        await driver.findElement(By.id('password')).sendKeys('sup123456');
        await driver.findElement(By.id('role')).sendKeys('supplier');


        await driver.findElement(By.css('button[type="submit"]')).click();
        console.log('Kayıt formu gönderildi');


        await driver.wait(until.alertIsPresent(), 3000);
        let alert = await driver.switchTo().alert();
        console.log('Alert mesajı:', await alert.getText());
        await alert.accept();
        console.log('Alert kapatıldı');


        await driver.wait(until.urlContains('login'), 5000);
        console.log('Login sayfasına yönlendirildi');


        await driver.findElement(By.id('username')).sendKeys('suppliertest11');
        await driver.findElement(By.id('password')).sendKeys('sup123456');

        await driver.findElement(By.id('loginButton')).click();
        console.log('Giriş yap butonuna tıklandı');


        await driver.wait(until.alertIsPresent(), 3000);
        let alert1 = await driver.switchTo().alert();
        console.log('Alert mesajı:', await alert1.getText());
        await alert1.accept();
        console.log('Alert kapatıldı');



        await driver.wait(until.urlContains('supplier.html'), 5000);
        console.log('Supplier sayfasına yönlendirildi, test başarılı!');

    } catch (err) {
        console.error('Test başarısız:', err);
    } finally {
        await driver.quit();
    }
})();
