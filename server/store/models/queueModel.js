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
    state.activeIndex = payload;
  }),
  
  updateActiveIndex: action((state, payload) => {
    state.activeIndex = payload;
  }),
  
  onRemoveItem: thunkOn(
    actions => actions.removeItem,
    (actions, target, helpers) => {
      const queue = helpers.getState();
      if (target.payload < queue.activeIndex) {
        actions.updateActiveIndex(queue.activeIndex - 1);
      } else if (target.payload === queue.items.length) {
        actions.updateActiveIndex(0);
        helpers.getStoreActions().player.quit();
      } else if (target.payload === queue.activeIndex) {
        actions.setActiveIndex(queue.activeIndex);
      }
    }
  ),
  
  onAddItemNextAndPlay: thunkOn(
    actions => actions.addItemNextAndPlay,
    (actions, target, helpers) => helpers.getState().items.length > 1 ?
      actions.setActiveIndex(helpers.getState().activeIndex + 1) :
      actions.setActiveIndex(0)
  )
};

module.exports = queueModel;
