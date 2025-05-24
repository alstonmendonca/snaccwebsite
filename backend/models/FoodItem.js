// backend/models/FoodItem.js
const mongoose = require('mongoose');

const FoodItemSchema = new mongoose.Schema({
  fid: { type: Number, required: true, unique: true },
  fname: { type: String, required: true },
  category: { type: Number, required: true },
  cost: { type: Number, required: true },
  sgst: { type: Number, required: true },
  cgst: { type: Number, required: true },
  tax: { type: Number, required: true },
  active: { type: Boolean, default: true },
  is_on: { type: Boolean, default: true },
  veg: { type: Boolean, required: true },
  depend_inv: { type: [String], default: [] },
}, {
  timestamps: true,
});

module.exports = mongoose.model('FoodItem', FoodItemSchema, 'FoodItem');
