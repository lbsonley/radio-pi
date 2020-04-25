const easyPeasy = require('easy-peasy');
const { createStore } = easyPeasy;
const storeModel = require('./models');

const store = createStore(storeModel);

module.exports = store;
