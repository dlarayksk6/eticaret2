const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  productId: String,
  name:      String,
  price:     Number,
  quantity:  Number
});

const orderSchema = new mongoose.Schema({
  userId:     { type: Number, required: true },
  items:      [orderItemSchema],
  totalPrice: { type: Number, required: true },
  createdAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);