const mongoose = require('mongoose');

const connectMongo = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/eticaret', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✔ MongoDB bağlantısı başarılı');
  } catch (err) {
    console.error('✘ MongoDB bağlantı hatası:', err);
  }
};
// ürün şeması
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    required: true,
    default: 0
  },
  supplierId: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: null
  },
  category: {
    type: String,
    default: 'Genel'
  },
  rating: {
    type: Number,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Product = mongoose.model('Product', productSchema);

module.exports = { connectMongo, Product };