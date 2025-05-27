let socket = null;
let orderBuffer = [];

function setSocket(ws) {
  // Clean up old socket listeners if any
  if (socket) {
    socket.removeAllListeners('open');
    socket.removeAllListeners('close');
    socket.removeAllListeners('error');
  }

  socket = ws;

  if (socket && socket.readyState === 1) {
    console.log('Socket already open. Flushing order buffer...');
    flushOrderBuffer();
  } else if (socket) {
    socket.once('open', () => {
      console.log('WebSocket connected, flushing orders...');
      flushOrderBuffer();
    });
  }

  // When socket closes or errors, clear the socket so new connection can be made
  socket.once('close', () => {
    console.warn('WebSocket closed');
    socket = null;
  });

  socket.once('error', (err) => {
    console.error('WebSocket error:', err);
    socket = null;
  });
}

function getSocket() {
  return socket;
}

function flushOrderBuffer() {
  console.log(`Flushing order buffer: ${orderBuffer.length} order(s)`);
  while (orderBuffer.length > 0 && socket && socket.readyState === 1) {
    const order = orderBuffer.shift();
    try {
      console.log(`Sending buffered order ${order.orderId}`);
      socket.send(JSON.stringify({ event: 'newOrder', data: order }));
    } catch (err) {
      console.error('Failed to send buffered order:', err);
      orderBuffer.unshift(order);
      break;
    }
  }
}

function queueOrder(order) {
  if (socket && socket.readyState === 1) {
    try {
      console.log(`Sending order ${order.orderId} immediately`);
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
  flushOrderBuffer,
};
