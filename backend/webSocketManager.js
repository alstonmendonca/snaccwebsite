let socket = null;
let orderBuffer = [];

function setSocket(ws) {
  if (socket) {
    socket.removeAllListeners();
  }

  socket = ws;

  if (socket.readyState === 1) {
    flushOrderBuffer();
  } else {
    socket.once('open', flushOrderBuffer);
  }

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
  console.log(`Flushing order buffer (${orderBuffer.length})`);
  while (orderBuffer.length > 0 && socket?.readyState === 1) {
    const order = orderBuffer.shift();
    try {
      socket.send(JSON.stringify({ event: 'newOrder', data: order }));
    } catch (err) {
      console.error('Send failed, rebuffering order');
      orderBuffer.unshift(order);
      break;
    }
  }
}

function queueOrder(order) {
  if (socket?.readyState === 1) {
    try {
      socket.send(JSON.stringify({ event: 'newOrder', data: order }));
    } catch (err) {
      console.error('Send failed, buffering:', err);
      orderBuffer.push(order);
    }
  } else {
    console.warn('Socket not connected, buffering...');
    orderBuffer.push(order);
  }
}

module.exports = {
  setSocket,
  getSocket,
  queueOrder,
  flushOrderBuffer,
};
