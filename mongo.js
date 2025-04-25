const mongoose = require('mongoose');

const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✔ MongoDB bağlantısı başarılı');
  } catch (err) {
    console.error('✘ MongoDB bağlantı hatası:', err);
  }
};

module.exports = connectMongo;