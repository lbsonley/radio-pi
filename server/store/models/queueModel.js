const easyPeasy = require('easy-peasy');
const { action, computed, thunkOn } = easyPeasy;

const queueModel = {
  items: [],
  activeIndex: 0,
  
  nowPlaying: computed(state => state.items[state.activeIndex]),
  
  addItemAtEnd: action((state, payload) => {
    state.items.push(payload);
  }),
  
  addItemNext: action((state, payload) => {
    if (state.items.length) {
      state.items.splice(state.activeIndex + 1, 0, payload);
    } else {
      state.items.push(payload);
    }
  }),
  
  addItemNextAndPlay: action((state, payload) => {
    if (state.items.length) {
      state.items.splice(state.activeIndex + 1, 0, payload);
    } else {
      state.items.push(payload);
    }
  }),
  
  removeItem: action((state, payload) => {
    state.items.splice(payload, 1);
  }),
  
  removeAllItems: action((state) => {
    state.items = [];
    state.activeIndex = 0;
  }),
  
  setActiveIndex: action((state, payload) => {
    state.activeIndex = payload
  }),
  
  onAddItemNextAndPlay: thunkOn(
    actions => actions.addItemNextAndPlay,
    (actions, payload, helpers) => helpers.getState().items.length > 1 ?
      actions.setActiveIndex(helpers.getState().activeIndex + 1) :
      actions.setActiveIndex(0)
  )
};

module.exports = queueModel;
