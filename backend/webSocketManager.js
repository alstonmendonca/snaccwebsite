// websocketManager.js
let socket = null;
let orderBuffer = [];

/**
 * Set the WebSocket instance and attempt to flush buffered orders
 */
function setSocket(ws) {
  socket = ws;

  if (socket && socket.readyState === 1) {
    flushOrderBuffer();
  } else {
    socket.on('open', () => {
      console.log('WebSocket connected, flushing orders...');
      flushOrderBuffer();
    });
  }
}

/**
 * Get the WebSocket instance
 */
function getSocket() {
  return socket;
}

/**
 * Send all orders in the buffer, if connected
 */
function flushOrderBuffer() {
  while (orderBuffer.length > 0 && socket && socket.readyState === 1) {
    const order = orderBuffer.shift();
    try {
      socket.send(JSON.stringify({ event: 'newOrder', data: order }));
    } catch (err) {
      console.error('Failed to send buffered order:', err);
      orderBuffer.unshift(order); // put back on buffer
      break;
    }
  }
}

/**
 * Buffer the order and try to flush if connected
 */
function queueOrder(order) {
  if (socket && socket.readyState === 1) {
    try {
      socket.send(JSON.stringify({ event: 'newOrder', data: order }));
    } catch (err) {
      console.error('Send failed, buffering order:', err);
      orderBuffer.push(order);
    }
  } else {
    console.warn('Socket not connected, buffering order...');
    orderBuffer.push(order);
  }
}

module.exports = {
  setSocket,
  getSocket,
  queueOrder,
  flushOrderBuffer
};
