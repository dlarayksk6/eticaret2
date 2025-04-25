const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name:      { type: String, required: true },
  price:     { type: Number, required: true },
  quantity:  { type: Number, required: true, default: 1 }
});

const cartSchema = new mongoose.Schema({
  userId:     { type: Number, required: true }, // MySQL'deki kullanıcı ID'si
  items:      [cartItemSchema],
  totalPrice: { type: Number, default: 0 }
});

module.exports = mongoose.model('Cart', cartSchema);