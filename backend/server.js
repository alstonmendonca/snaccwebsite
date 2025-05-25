const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: './backend/.env' });

const FoodItem = require('./models/FoodItem'); // import model

const app = express();
const userRoutes = require('./routes/user'); // ✅ Import the user route
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
// ✅ GET /fooditems — Fetch food items with category name
app.get('/fooditems', async (req, res) => {
  try {
    const items = await FoodItem.aggregate([
      {
        $lookup: {
          from: 'Category',              // name of the category collection
          localField: 'category',        // FoodItem.category
          foreignField: 'catid',         // Category.catid
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
          catname: '$category_info.catname', // add catname directly
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

    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

app.use('/users', userRoutes); // ✅ Mount the user route at /users
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});
