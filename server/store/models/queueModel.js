const easyPeasy = require('easy-peasy');
const { action, computed, thunk, thunkOn } = easyPeasy;

const queueModel = {
  /**
   * State
   */

  items: [],
  activeIndex: 0,

  /**
   * Computed State
   */

  nowPlaying: computed(state => state.items[state.activeIndex]),
  
  /**
   * Actions
   */

  addItemAtEnd: action((state, payload) => {
    state.items.push(payload);
  }),
  
  removeItem: action((state, payload) => {
    state.items.splice(payload, 1);
  }),
  
  removeAllItems: action((state) => {
    state.items = [];
    state.activeIndex = 0;
  }),
  
  updateActiveIndex: action((state, payload) => {
    state.activeIndex = payload;
  }),
   
  addItemNext: action((state, payload) => {
    if (state.items.length) {
      state.items.splice(state.activeIndex + 1, 0, payload);
    } else {
      state.items.push(payload);
    }
  }),
  
  /**
   * Thunks
   */
   
  /**
   * @description: Used to select next or previous track
   */
  skipTrack: thunk((actions, payload, { getState }) => {
    return new Promise((resolve, reject) => {
      const oldActiveIndex = getState().activeIndex;
      actions.updateActiveIndex(payload);
      const nowPlaying = getState().nowPlaying;
      if (nowPlaying) {
        resolve();
      } else {
        actions.updateActiveIndex(oldActiveIndex);
        reject();
      }
    });
  }),
  
  /**
   * @description: Used to select a specific track from queue
   */
  setTrack: thunk((actions, payload, { getState }) => {
    actions.updateActiveIndex(payload);
  }),
  
  addItemNextAndPlay: thunk((actions, payload, { getState }) => {
    actions.addItemNext(payload);
    const state = getState();
    if (state.items.length > 1) {
      actions.updateActiveIndex(state.activeIndex + 1)
    } else {
      actions.updateActiveIndex(0);
    }
  }),
  
  /**
   * Listeners
   */
  
  onRemoveItem: thunkOn(
    actions => actions.removeItem,
    (actions, target, { getState, getStoreActions, getStoreState }) => {
      const queue = getState();
      const io = getStoreState().socket.io;

      if (target.payload < queue.activeIndex) {
        actions.updateActiveIndex(queue.activeIndex - 1);
      } else if (target.payload === queue.items.length) {
        actions.updateActiveIndex(0);
        getStoreActions().player.quit();
      } else if (target.payload === queue.activeIndex) {
        actions.setTrack(queue.activeIndex);
      }
      
      io.emit('queue', getState());
      io.emit('message', {
        message: `Removed item ${target.payload} from queue`,
        key: 'removeItem',
        severity: 'success'
      });
    }
  ),

};

module.exports = queueModel;
