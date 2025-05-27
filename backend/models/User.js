const mongoose = require('mongoose');

// Cart item subdocument (still embedded in user document)
const cartItemSchema = new mongoose.Schema({
  fid: { type: Number, required: true },
  quantity: { type: Number, default: 1 }
}, { _id: false });

// Define main user schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password_hash: String,
  mobile: String,
  dob: { type: Date, default: null },
  address: { type: String, default: null },
  cart: { type: [cartItemSchema], default: [] }  // cart stays embedded
});

module.exports = mongoose.model('User', userSchema, 'website_users');
