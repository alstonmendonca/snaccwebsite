const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config({ path: './backend/.env' });

const FoodItem = require('./models/FoodItem');
const userRoutes = require('./routes/user');

const app = express();

// ======================
// Security Middleware
// ======================
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));

// ======================
// Rate Limiting
// ======================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// ======================
// Request Logging
// ======================
app.use(morgan('dev'));

// ======================
// Environment Validation
// ======================
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI is not defined');
  process.exit(1);
}

// ======================
// Database Connection
// ======================
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    startServer();
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

function startServer() {
  // ======================
  // Existing Routes (unchanged)
  // ======================
  app.get('/', (req, res) => {
    res.send('Server is running');
  });

  app.use('/users', userRoutes);

  // ======================
  // Original Fooditems Route
  // ======================
  app.get('/fooditems', async (req, res, next) => {
    try {
      const items = await FoodItem.aggregate([
        {
          $lookup: {
            from: 'Category',
            localField: 'category',
            foreignField: 'catid',
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
            catname: '$category_info.catname',
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
      next(err);
    }
  });

  // ======================
  // Error Handling Middleware
  // ======================
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
    });
  });

  // ======================
  // Unhandled Rejections
  // ======================
  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  });

  // ======================
  // Server Start
  // ======================
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
  });
}