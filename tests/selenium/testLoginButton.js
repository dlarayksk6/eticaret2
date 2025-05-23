const { Builder, By, until } = require('selenium-webdriver');

(async function testNavigateToLoginFromRegister() {
    const driver = await new Builder().forBrowser('chrome').build();



    await driver.get('http://localhost:5000/register.html');


    const loginLink = await driver.findElement(By.linkText('Giriş Yap'));


    await loginLink.click();

    await driver.wait(until.urlContains('login.html'), 5000);
    console.log('Başarıyla login.html sayfasına yönlendirildi.');

    await driver.findElement(By.id('registerButton')).click();
    console.log('Üye ol butonuna tıklandı');

    await driver.wait(until.urlContains('register.html'), 5000);
    console.log('Başarıyla register.html sayfasına yönlendirildi.');


    console.log('Test Başarılı');



})();
