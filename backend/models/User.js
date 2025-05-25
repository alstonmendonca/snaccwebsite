const mongoose = require('mongoose');

// Define order subdocument schema
const orderSchema = new mongoose.Schema({
  order_id: Number,
  order_items: [Number], // You can replace Number with ObjectId if referencing a separate products/items collection
  completed: { type: Boolean, default: false }
}, { _id: false }); // Prevent automatic _id creation for each subdocument (optional)


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
  orders: { type: [orderSchema], default: [] },
  cart: { type: [cartItemSchema], default: [] }  // <-- cart with quantity
});

module.exports = mongoose.model('User', userSchema, 'website_users'); // 'website_users' is the collection name
