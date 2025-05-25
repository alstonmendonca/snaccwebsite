// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password_hash: String,
  mobile: String,
  dob: { type: Date, default: null },
  address: { type: String, default: null },
});

module.exports = mongoose.model('User', userSchema, 'website_users'); // 'website_users' is the collection name
