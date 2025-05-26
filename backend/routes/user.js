const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();
const FoodItem = require('../models/FoodItem');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const authenticateToken = require('../middleware/auth');

// --- Signup ---
router.post('/signup', async (req, res) => {
  const { name, email, password, mobile } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already exists' });

    const password_hash = await bcrypt.hash(password, 12);
    const newUser = new User({
      name,
      email,
      password_hash,
      mobile,
      dob: null,
      address: null,
      orders: [],
      cart: [],  // Make sure cart is initialized here
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Signin ---
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Sign-in successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Get user profile ---
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Update user profile ---
router.put('/profile', authenticateToken, async (req, res) => {
  const allowedFields = ['name', 'mobile', 'dob', 'address'];
  const updateData = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined && req.body[field] !== null && req.body[field] !== '') {
      updateData[field] = req.body[field];
    }
  }

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password_hash');

    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// --- Get user cart ---
router.get('/cart', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ cart: user.cart || [] });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// --- Add/update item in cart ---
// Accepts { fid: Number, quantity: Number }
router.post('/cart/add', authenticateToken, async (req, res) => {
  try {
    let { fid, quantity } = req.body;

    // Convert to number explicitly (if possible)
    fid = Number(fid);
    quantity = Number(quantity);

    if (!Number.isInteger(fid) || fid <= 0 || !Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: 'fid must be a positive integer and quantity must be at least 1' });
    }

    const user = req.user;
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!Array.isArray(user.cart)) {
      user.cart = [];
    }

    const existingIndex = user.cart.findIndex(item => item.fid === fid);

    if (existingIndex > -1) {
      user.cart[existingIndex].quantity = quantity; // update quantity
    } else {
      user.cart.push({ fid, quantity });
    }

    await user.save();

    res.json({ message: 'Cart updated', cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});



// --- Remove/decrement item from cart ---
// Accepts { fid: Number }
router.post('/cart/remove', authenticateToken, async (req, res) => {
  try {
    const { fid } = req.body;
    
    // Validate fid type
    if (typeof fid !== 'number') {
      return res.status(400).json({ error: 'Invalid food item ID format' });
    }

    const user = req.user;
    if (!user) return res.status(404).json({ error: 'User not found' });

    const itemIndex = user.cart.findIndex(item => item.fid === fid);
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }

    // Validate quantity
    if (user.cart[itemIndex].quantity < 1) {
      return res.status(400).json({ error: 'Invalid item quantity' });
    }

    // Atomic operation
    if (user.cart[itemIndex].quantity > 1) {
      user.cart[itemIndex].quantity -= 1;
    } else {
      user.cart.splice(itemIndex, 1);
    }

    // Explicit schema validation
    await user.validate();
    await user.save();
    
    return res.json({
      success: true,
      message: 'Cart updated successfully',
      cart: user.cart
    });

  } catch (err) {
    console.error('Cart update error:', err);
    return res.status(500).json({ 
      error: 'Server error',
      details: err.message
    });
  }
});
// --- Clear entire cart ---
router.post('/cart/clear', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.cart = [];
    await user.save();
    res.json({ message: 'Cart cleared', cart: user.cart });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

router.get('/cart/details', authenticateToken, async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ message: 'User not found' });

    // If cart empty, return empty array early
    if (!user.cart || user.cart.length === 0) return res.json([]);

    // Extract all fids from user.cart
    const fids = user.cart.map(item => item.fid);

    // Aggregate food items matching fids + join with category collection
    const items = await FoodItem.aggregate([
      { $match: { fid: { $in: fids } } },
      {
        $lookup: {
          from: 'Category',            // category collection name
          localField: 'category',      // FoodItem.category
          foreignField: 'catid',       // Category.catid
          as: 'category_info'
        }
      },
      {
        $unwind: {
          path: '$category_info',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          fid: 1,
          fname: 1,
          category: 1,
          catname: '$category_info.catname', // join category name
          cost: 1,
          sgst: 1,
          cgst: 1,
          tax: 1,
          active: 1,
          is_on: 1,
          veg: 1,
          depend_inv: 1,
          createdAt: 1,
          updatedAt: 1
        }
      }
    ]);

    // Merge quantity info from cart into the aggregated items
    const itemsWithQuantity = items.map(foodItem => {
      const cartItem = user.cart.find(ci => ci.fid === foodItem.fid);
      return {
        ...foodItem,
        quantity: cartItem ? cartItem.quantity : 0,
      };
    });

    res.json(itemsWithQuantity);
  } catch (err) {
    console.error('Error getting cart details:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

module.exports = router;
