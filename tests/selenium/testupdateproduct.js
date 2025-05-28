const { Builder, By, until } = require('selenium-webdriver');

(async function testSupplierUpdateProduct() {
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


        const editButton = await driver.wait(
            until.elementLocated(By.css('.edit-btn')),
            10000
        );
        await editButton.click();

        await driver.wait(until.elementLocated(By.id('editProductForm')), 10000);
        await driver.wait(until.elementLocated(By.id('editProductName')), 10000);
        await driver.wait(until.elementLocated(By.id('editProductDescription')), 10000);
        await driver.wait(until.elementLocated(By.id('editProductPrice')), 10000);
        await driver.wait(until.elementLocated(By.id('editProductStock')), 10000);


        await driver.findElement(By.id('editProductName')).clear();
        await driver.findElement(By.id('editProductName')).sendKeys('Güncellenmiş Test Ürün');
        await driver.findElement(By.id('editProductDescription')).clear();
        await driver.findElement(By.id('editProductDescription')).sendKeys('Güncellenmiş test ürün açıklaması');
        await driver.findElement(By.id('editProductPrice')).clear();
        await driver.findElement(By.id('editProductPrice')).sendKeys('150');
        await driver.findElement(By.id('editProductStock')).clear();
        await driver.findElement(By.id('editProductStock')).sendKeys('75');


        await driver.findElement(By.css('#editProductForm button[type="submit"]')).click();


        await driver.wait(until.alertIsPresent(), 3000);
        let alert = await driver.switchTo().alert();
        console.log('Ürün güncelleme sonucu:', await alert.getText());
        await alert.accept();

    } catch (err) {
        console.error('Test başarısız:', err);
    } finally {
        await driver.quit();
    }
})();