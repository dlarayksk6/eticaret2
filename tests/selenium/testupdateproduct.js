const { Builder, By, until } = require('selenium-webdriver');

(async function testSupplierUpdateProduct() {
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

        // İlk ürünün düzenle butonunu bul ve tıkla
        const editButton = await driver.wait(
            until.elementLocated(By.css('.edit-btn')),
            10000
        );
        await editButton.click();

        // Modal'ın açılmasını ve form elementlerinin yüklenmesini bekle
        await driver.wait(until.elementLocated(By.id('editProductForm')), 10000);
        await driver.wait(until.elementLocated(By.id('editProductName')), 10000);
        await driver.wait(until.elementLocated(By.id('editProductDescription')), 10000);
        await driver.wait(until.elementLocated(By.id('editProductPrice')), 10000);
        await driver.wait(until.elementLocated(By.id('editProductStock')), 10000);

        // Form alanlarını temizle ve yeni değerlerle doldur
        await driver.findElement(By.id('editProductName')).clear();
        await driver.findElement(By.id('editProductName')).sendKeys('Güncellenmiş Test Ürün');
        await driver.findElement(By.id('editProductDescription')).clear();
        await driver.findElement(By.id('editProductDescription')).sendKeys('Güncellenmiş test ürün açıklaması');
        await driver.findElement(By.id('editProductPrice')).clear();
        await driver.findElement(By.id('editProductPrice')).sendKeys('150');
        await driver.findElement(By.id('editProductStock')).clear();
        await driver.findElement(By.id('editProductStock')).sendKeys('75');

        // Formu gönder
        await driver.findElement(By.css('#editProductForm button[type="submit"]')).click();

        // Başarılı mesajını kontrol et
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