const { Builder, By, until } = require('selenium-webdriver');

(async function testSupplierAddProduct() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {

        await driver.get('http://localhost:5000/login.html');
        await driver.findElement(By.id('username')).sendKeys('suppliertest11');
        await driver.findElement(By.id('password')).sendKeys('sup123456');
        await driver.findElement(By.id('loginButton')).click();

        await driver.wait(until.alertIsPresent(), 5000);
        let loginAlert = await driver.switchTo().alert();
        console.log('Login alert mesajı:', await loginAlert.getText());
        await loginAlert.accept();

        await driver.sleep(5000);

        await driver.get('http://localhost:5000/supplier.html');


        await driver.sleep(5000);


        const addButton = await driver.wait(
            until.elementLocated(By.id('addProductBtn')),
            10000
        );
        await addButton.click();


        await driver.wait(until.elementLocated(By.id('addProductForm')), 10000);
        await driver.wait(until.elementLocated(By.id('productName')), 10000);
        await driver.wait(until.elementLocated(By.id('productDescription')), 10000);
        await driver.wait(until.elementLocated(By.id('productPrice')), 10000);
        await driver.wait(until.elementLocated(By.id('productStock')), 10000);


        await driver.findElement(By.id('productName')).sendKeys('Test Ürün');
        await driver.findElement(By.id('productDescription')).sendKeys('Test ürün açıklaması');
        await driver.findElement(By.id('productPrice')).sendKeys('100');
        await driver.findElement(By.id('productStock')).sendKeys('50');

        await driver.findElement(By.css('#addProductForm button[type="submit"]')).click();


        await driver.wait(until.alertIsPresent(), 3000);
        let alert = await driver.switchTo().alert();
        console.log('Ürün ekleme sonucu:', await alert.getText());
        await alert.accept();

    } catch (err) {
        console.error('Test başarısız:', err);
    } finally {
        await driver.quit();
    }
})();
