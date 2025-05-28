const { Builder, By, until } = require('selenium-webdriver');

(async function testSupplierDeleteProduct() {
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


        await driver.sleep(10000);


        await driver.get('http://localhost:5000/supplier.html');

        await driver.sleep(10000);


        await driver.wait(until.elementLocated(By.tagName('body')), 15000);


        await driver.wait(until.elementLocated(By.tagName('table')), 15000);


        let deleteButton;
        try {
            deleteButton = await driver.wait(
                until.elementLocated(By.css('.delete-product-btn')),
                5000
            );
        } catch (e) {
            try {
                deleteButton = await driver.wait(
                    until.elementLocated(By.css('button[onclick*="delete"]')),
                    5000
                );
            } catch (e) {
                deleteButton = await driver.wait(
                    until.elementLocated(By.xpath("//button[contains(text(), 'Sil')]")),
                    5000
                );
            }
        }


        await driver.sleep(2000);
        await deleteButton.click();


        await driver.wait(until.alertIsPresent(), 5000);
        let deleteAlert = await driver.switchTo().alert();
        console.log('Silme onay mesajı:', await deleteAlert.getText());
        await deleteAlert.accept();


        await driver.wait(until.alertIsPresent(), 5000);
        let successAlert = await driver.switchTo().alert();
        console.log('Ürün silme sonucu:', await successAlert.getText());
        await successAlert.accept();

    } catch (err) {
        console.error('Test başarısız:', err);
    } finally {
        await driver.quit();
    }
})();