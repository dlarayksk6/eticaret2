# Hibrit Veritabanı ile E-Ticaret Sistemi

## Proje Tanımı
- MySQL kullanarak müşteri ve tedarikçi verilerini MySQL'de sipariş,sepet verilerini MongoDb de kaydederek bir e ticaret sitesi oluşturmak
- Veri kayıtlarını postmanla test etmek


## Kullanılan Teknolojiler
-  Node.js (Express.js)
  - MySQL (Kullanıcı,tedarikçi bilgileri için)
  - MongoDB (Sepet ve ürün yönetimi için)
-  JWT (JSON Web Token)
-  Postman
- SMTP üzerinden otomatik e-posta gönderimi
- Bootsrap

## Proje Özellikleri
- **Kullanıcı Kaydı ve Girişi:**
  - MySQL üzerinde kullanıcı bilgileri tutulur.
  - Başarılı giriş sonrası kullanıcıya JWT token verilir.
- **Rol Tabanlı Giriş Sistemi:**
  - Kullanıcı rolleri: `müşteri` ve `tedarikçi`
  - Rol bilgisi JWT içine eklenir, API erişimi buna göre kontrol edilir.
- **Şifremi Unuttum Fonksiyonu:**
  - Kayıtlı e-posta adresine şifre sıfırlama bağlantısı gönderilir.

- **Sepet Yönetimi:**
  - Ürünler kullanıcı ID ile MongoDB'ye kaydedilir.
  - Sepet bilgileri ve toplam fiyat MongoDB'den çekilir.
- **Tedarikçi Ürün Yönetimi:**
  - Tedarikçiler ürün ekleme, güncelleme ve silme işlemleri yapabilir.
- **Ürün Silme Etkisi:**
  - Ürün başka kullanıcıların sepetindeyse soft-delete yapılır veya kullanıcıya bilgi verilir.
- **Email Bildirimleri:**
  - Sepete ürün eklenince "Sepetiniz Güncellendi" e-postası
  - Sipariş tamamlanınca "Siparişiniz Alındı" e-postası gönderilir.

## Kurulum ve Çalıştırma Adımları

### 1. Depoyu Klonlayın
```bash
git clone https://github.com/dlarayksk6/eticaret2.git
cd eticaret2
```

### 2. Gerekli Paketleri Yükleyin

- Node.js için:
```bash
npm install
```

### 3. Veritabanı Yapılandırmaları
- MySQL'de gerekli tabloları oluşturun.
- MongoDB bağlantısını yapılandırın.

### 4. Ortam Değişkenlerini Tanımlayın (.env)
```env
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=şifreniz
MYSQL_DB=veritabani_adi
MONGO_URI=mongodb://localhost:27017/sepet_db
JWT_SECRET=secretkey

```

### 5. Uygulamayı Başlatın

- Node.js Express için:
```bash
node server.js
```

### 6. API'leri Test Edin
- Postman ile API test koleksiyonunu içe aktararak tüm endpoint'leri test edin.

## API Dokümantasyonu
Tüm API endpoint açıklamaları Postman koleksiyonunda yer almaktadır.

## Proje Yapısı
``` 
/eticaret2
    /controllers
        /authController.js
    /middleware
        auth.js
    /models
        /Cart.js
        /Order.js
        /supplierProfile.js
        /User.js
    /postman
    /public
        /cart.html
        /customer.html
        /forgotpassword.html
        /index.html
        /login.html
        /register.html
        /style.css
        /supplier-dashboard.html
        /supplier-dashboard.js
        /supplier.html
    /routes
        /authRoutes.js
        /cart.js
        /order.js
        /product.js
        /supplierRoutes.js
    /.env
    /README.md
    /db.js
    /mongo.js
    /server.js
    
```

