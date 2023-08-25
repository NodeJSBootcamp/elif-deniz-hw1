# TWEET REST API

- .env dsoyasını bilerek ignore etmedim.
- Ana dizinde bulunan NodeCamp2.postman_collection.json dosyasında postman testlerini export ettim.

## EXTRAS

- response status ları handle etmek için "http-status-codes" paketini kullandım
- JWT secret key için node command da "require('crypto').randomBytes(64).toString('hex')" bu komutu çalıştırıp 16lık bir key oluşturdum.
- Veritabanına şifre kaydederken bcrypt.hash methoduyla şifreledim ve bunu Mongo middleware da pre save metoduyla User.model.ts dosyasında yaptım.

- Kullanıcı giriş yaparken jwt oluşturma işlemini Mongo'da custom metot olarak createJWT metodunu User.model.ts dosyasında oluşturdum ve bunu User.controller.ts dosyasında mongoda kullanıcıyı bulduktan sonra çağırdım.
