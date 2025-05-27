let electronSocket = null;

module.exports = {
  getSocket: () => electronSocket,
  setSocket: (socket) => {
    electronSocket = socket;
  }
};
