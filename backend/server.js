const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: './backend/.env' });

const FoodItem = require('./models/FoodItem'); // import model

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Sample route
app.get('/', (req, res) => {
  res.send('Server is running');
});

// ✅ GET /fooditems — Fetch all food items
app.get('/fooditems', async (req, res) => {
  try {
    const items = await FoodItem.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
