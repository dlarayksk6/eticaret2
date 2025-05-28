const { Builder, By, until } = require('selenium-webdriver');

(async function testSupplierAddProduct() {
    let driver = await new Builder().forBrowser('chrome').build();

    try {
        // Tedarikçi girişi
        await driver.get('http://localhost:5000/login.html');
        await driver.findElement(By.id('username')).sendKeys('buse12');
        await driver.findElement(By.id('password')).sendKeys('buse1278');
        await driver.findElement(By.id('loginButton')).click();

        // Login sonrası alert'i bekle ve kabul et
        await driver.wait(until.alertIsPresent(), 5000);
        let loginAlert = await driver.switchTo().alert();
        console.log('Login alert mesajı:', await loginAlert.getText());
        await loginAlert.accept();

        // Login sonrası 5 saniye bekle
        await driver.sleep(5000);

        // Tedarikçi paneline git
        await driver.get('http://localhost:5000/supplier.html');

        // Tedarikçi paneli yüklendikten sonra 5 saniye bekle
        await driver.sleep(5000);

        // Yeni Ürün Ekle butonunu bul ve tıkla
        const addButton = await driver.wait(
            until.elementLocated(By.id('addProductBtn')),
            10000
        );
        await addButton.click();

        // Modal'ın açılmasını ve form elementlerinin yüklenmesini bekle
        await driver.wait(until.elementLocated(By.id('addProductForm')), 10000);
        await driver.wait(until.elementLocated(By.id('productName')), 10000);
        await driver.wait(until.elementLocated(By.id('productDescription')), 10000);
        await driver.wait(until.elementLocated(By.id('productPrice')), 10000);
        await driver.wait(until.elementLocated(By.id('productStock')), 10000);

        // Form alanlarını doldur
        await driver.findElement(By.id('productName')).sendKeys('Test Ürün');
        await driver.findElement(By.id('productDescription')).sendKeys('Test ürün açıklaması');
        await driver.findElement(By.id('productPrice')).sendKeys('100');
        await driver.findElement(By.id('productStock')).sendKeys('50');

        // Formu gönder
        await driver.findElement(By.css('#addProductForm button[type="submit"]')).click();

        // Başarılı mesajını kontrol et
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
