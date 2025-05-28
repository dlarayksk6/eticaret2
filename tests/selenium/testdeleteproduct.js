const { Builder, By, until } = require('selenium-webdriver');

(async function testSupplierDeleteProduct() {
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

        // Login sonrası 10 saniye bekle
        await driver.sleep(10000);

        // Tedarikçi paneline git
        await driver.get('http://localhost:5000/supplier.html');

        // Tedarikçi paneli yüklendikten sonra 10 saniye bekle
        await driver.sleep(10000);

        // Sayfanın tamamen yüklenmesini bekle
        await driver.wait(until.elementLocated(By.tagName('body')), 15000);

        // Silme butonunu bul ve tıkla (ilk ürünün silme butonu)
        // Önce tabloyu bekle
        await driver.wait(until.elementLocated(By.tagName('table')), 15000);

        // Silme butonunu bul (birden fazla seçici dene)
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

        // Butona tıklamadan önce kısa bir bekleme
        await driver.sleep(2000);
        await deleteButton.click();

        // Silme onay alert'ini bekle ve onayla
        await driver.wait(until.alertIsPresent(), 5000);
        let deleteAlert = await driver.switchTo().alert();
        console.log('Silme onay mesajı:', await deleteAlert.getText());
        await deleteAlert.accept();

        // Başarılı silme mesajını kontrol et
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