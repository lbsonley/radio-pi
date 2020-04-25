const socketModel = require('./socketModel');
const playerModel = require('./playerModel');
const queueModel = require('./queueModel');
const libraryModel = require('./libraryModel');

const storeModel = {
  socket: socketModel,
  player: playerModel,
  library: libraryModel,
  queue: queueModel
};

module.exports = storeModel;
