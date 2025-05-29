const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const http = require('http'); // ✅ Required for WebSocket server
const WebSocket = require('ws');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const FoodItem = require('./models/FoodItem');
const userRoutes = require('./routes/user');
const { setSocket, getSocket, queueOrder } = require('./webSocketManager'); // ✅ Added queueOrder

const app = express();
const server = http.createServer(app); // ✅ Correct server used for WebSocket
const wss = new WebSocket.Server({ server });

// Store one persistent Electron connection
let electronSocket = null;

// ======================
// Security Middleware
// ======================
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));
app.set('trust proxy', 1);

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
// Logging
// ======================
app.use(morgan('dev'));

// ======================
// Environment Check
// ======================
if (!process.env.MONGO_URI) {
  console.error('❌ MONGO_URI is not defined');
  process.exit(1);
}

// ======================
// MongoDB Connection
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

// ======================
// Start Server
// ======================
function startServer() {
  // Routes
  app.get('/', (req, res) => {
    res.send('Server is running');
  });

  app.use('/users', userRoutes);

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
        { $unwind: { path: '$category_info', preserveNullAndEmptyArrays: true } },
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

  // Error handling
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
    });
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
  });

  // WebSocket connection handler
  wss.on('connection', (ws, req) => {
    console.log('Electron WebSocket connected from', req.socket.remoteAddress);

    electronSocket = ws;
    setSocket(ws); // Optional, if you're managing via socket manager

    ws.on('message', (msg) => {
      console.log('Message from Electron:', msg.toString());
    });

    ws.on('close', () => {
      console.warn('Electron WebSocket disconnected');
      electronSocket = null;
    });

    ws.on('error', (err) => {
      console.error('WebSocket error:', err.message);
      electronSocket = null;
    });
  });

  // Start combined HTTP + WebSocket server
  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
  });
}
