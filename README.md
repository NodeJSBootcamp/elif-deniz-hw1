# TWEET REST API

- .env dsoyasını bilerek ignore etmedim.

## EXTRAS

- response status ları handle etmek için "http-status-codes" paketini kullandım
- JWT secret key için node command da "require('crypto').randomBytes(64).toString('hex')" bu komutu çalıştırıp 16lık bir key oluşturdum.
- Veritabanına şifre kaydederken bcrypt.hash methoduyla şifreledim ve bunu Mongo middleware da pre save metoduyla yaptım:

* UserSchema.pre<IUser>('save', async function(){
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

})

- Kullanıcı giriş yaparken jwt oluşturma işlemini Mongo'da custom metot olarak createJWT metodu oluşturdum ve bunu User.controller da mongoda kullanıcıyı bulduktan sonra çağırdım:
  UserSchema.methods.createJWT= function(){
  const payload: object={username: this.username, isAdmin: this.isAdmin, userId: this.\_id}
  return jwt.sign(payload, process.env.JWT_SECRET_KEY as string, {expiresIn: process.env.JWT_EXPIRE as string})
  }
