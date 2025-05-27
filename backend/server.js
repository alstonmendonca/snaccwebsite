const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config({ path: './backend/.env' });
const dns = require('dns').promises;
const FoodItem = require('./models/FoodItem');
const userRoutes = require('./routes/user');
const { setSocket, getSocket } = require('./electronSocket');
const dns = require('dns').promises;
const app = express();
const WebSocket = require('ws');

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
  // Cloudflare Tunnel WebSocket
  // ======================
async function createWebSocketWithIPv4(wsUrl) {
  const urlObj = new URL(wsUrl);
  const hostname = urlObj.hostname;
  const port = urlObj.port || (urlObj.protocol === 'wss:' ? 443 : 80);
  const protocol = urlObj.protocol.slice(0, -1); // 'ws' or 'wss'

  // Resolve hostname to IPv4 address explicitly
  const { address: ip } = await dns.lookup(hostname, { family: 4 });

  // Create WebSocket with IP but override Host header and TLS SNI
  const ws = new WebSocket(`${protocol}://${ip}:${port}`, {
    headers: {
      Host: hostname
    },
    servername: hostname // for TLS SNI (needed for wss)
  });

  return ws;
}
app.post('/api/register-electron-tunnel', async (req, res) => {
  const { wsUrl } = req.body;
  console.log('Received Electron WebSocket URL:', wsUrl);

  if (electronSocket) {
    console.log('Closing previous Electron WebSocket connection');
    electronSocket.close();
    electronSocket = null;
  }

  try {
    const hostname = new URL(wsUrl).hostname;
    await waitForDns(hostname); // your existing DNS wait helper if any

    const ws = await createWebSocketWithIPv4(wsUrl);

    ws.on('open', () => {
      console.log('Connected to Electron app via tunnel');
      electronSocket = ws;
      ws.send('Hello from the backend!');
    });

    ws.on('message', (msg) => {
      console.log('Message from Electron app:', msg.toString());
    });

    ws.on('close', () => {
      console.log('Electron WebSocket disconnected');
      electronSocket = null;
    });

    ws.on('error', (err) => {
      console.error('WebSocket error:', err.message);
    });

    res.status(200).json({ status: 'WebSocket connection initiated' });
  } catch (error) {
    console.error('Failed to connect WebSocket:', error.message);
    res.status(500).json({ error: 'Failed to establish WebSocket connection' });
  }
});

app.post('/api/register-electron-tunnel', async (req, res) => {
  const { wsUrl } = req.body;
  console.log('Received Electron WebSocket URL:', wsUrl);

  const existingSocket = getSocket();
  if (existingSocket) {
    console.log('Closing previous Electron WebSocket connection');
    existingSocket.close();
    setSocket(null);
  }

  try {
    const hostname = new URL(wsUrl).hostname;
    await waitForDns(hostname);

    const ws = new WebSocket(wsUrl);

    ws.on('open', () => {
      console.log('Connected to Electron app via tunnel');
      setSocket(ws);
      ws.send('Hello from the backend!');
    });

    ws.on('message', (msg) => {
      console.log('Message from Electron app:', msg.toString());
    });

    ws.on('close', () => {
      console.log('Electron WebSocket disconnected');
      setSocket(null);
    });

    ws.on('error', (err) => {
      console.error('WebSocket error:', err.message);
    });

    res.status(200).json({ status: 'WebSocket connection initiated' });
  } catch (error) {
    console.error('Failed to connect WebSocket:', error.message);
    res.status(500).json({ error: 'Failed to establish WebSocket connection' });
  }
});

  // ======================
  // Server Start
  // ======================
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server listening on port ${PORT}`);
  });
}