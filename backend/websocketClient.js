// websocketClient.js
const WebSocket = require('ws');

const TUNNEL_URL = 'wss://your-cloudflare-tunnel.trycloudflare.com'; // replace with your actual wss URL
const ws = new WebSocket(TUNNEL_URL);

ws.on('open', () => {
  console.log('WebSocket connected to Cloudflare Tunnel');
});

ws.on('error', (err) => {
  console.error('WebSocket error:', err.message);
});

ws.on('close', () => {
  console.log('WebSocket connection closed');
});

ws.on('message', (data) => {
  console.log('Message from tunnel server:', data);
});

module.exports = ws;
