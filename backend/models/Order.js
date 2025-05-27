// models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  cartItems: [
    {
      _id: { type: mongoose.Schema.Types.ObjectId, required: true }, // item/product ID
      title: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    }
  ],
  datetime: {
    type: Date,
    required: true,
  },
  paymentId: {
    type: String,
    default: null,
  },
  paymentMethod: {
    type: String,
    enum: ['online', 'cafe'],
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
