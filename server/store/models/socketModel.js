const easyPeasy = require('easy-peasy');
const { action, thunkOn } = easyPeasy;

const socketModel = {
  io: null,
  
  setSocket: action((state, payload) => {
    state.io = payload;
  }),
  
  onPlay: thunkOn(
    (actions, storeActions) => [
      storeActions.player.play.successType,
      storeActions.player.play.failType
    ],
    (actions, target, helpers) => {
      const io = helpers.getState().io;
      const [ successType, failType ] = target.resolvedTargets;

      switch (target.type) {
        case successType:
          io.emit('message', {
            message: `Now Playing: ${target.payload.name}`,
            key: target.payload.path,
            severity: 'success'
          });
          break;
        case failType:
          io.emit('message', {
            message: `Failed to play: ${target.payload.name}`,
            key: target.payload.path,
            severity: 'error'
          });
          break;
        default:
          return;
      }
    }
  ),
  
  
  onSetMusic: thunkOn(
    (actions, storeActions) => storeActions.library.setMusic,
    (actions, target, helpers) => {
      const io = helpers.getState().io;
      
      io.emit('message', {
        message: `Library Loaded`,
        key: 'libraryLoaded',
        severity: 'success'
      });
      io.emit('library', target.payload);
    }
  ),
  
  onUpdateQueue: thunkOn(
    (actions, storeActions) => Object.values(storeActions.queue),
    (actions, target, helpers) => {
      const queue = helpers.getStoreState().queue;
      const io = helpers.getState().io;
      
      io.emit('queue', helpers.getStoreState().queue)
      
      const [
        addItemAtEnd,
        addItemNext,
        addItemNextAndPlay,
        removeItem,
        removeAllItems
      ] = target.resolvedTargets;

      switch (target.type) {
        case addItemAtEnd:
          io.emit('message', {
            message: `Added to end of queue: ${target.payload.name}`,
            key: target.payload.path,
            severity: 'success'
          });
          break;
        case addItemNext:
          io.emit('message', {
            message: `Added next in queue: ${target.payload.name}`,
            key: target.payload.path,
            severity: 'success'
          });
          break;
        case addItemNextAndPlay:
          io.emit('message', {
            message: `Added next in queue: ${target.payload.name}`,
            key: 'addNextAndPlay',
            severity: 'success'
          });
          break;
        case removeItem:
          io.emit('message', {
            message: `Removed item ${target.payload} from queue`,
            key: 'removeItem',
            severity: 'success'
          });
          break;
        case removeAllItems:
          io.emit('message', {
            message: 'Cleared Queue',
            key: 'clear',
            severity: 'success'
          });
          break;
        default:
          return;
      }
    }
  )
  
};

module.exports = socketModel;
