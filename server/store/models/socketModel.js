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
      storeActions.player.play.failType,
      storeActions.player.resume,
      storeActions.player.pause,
      storeActions.player.quit
    ],
    (actions, target, helpers) => {
      const io = helpers.getState().io;
      const playerState = helpers.getStoreState().player;
      const [
        playSuccessType,
        playFailType,
        resume,
        pause,
        quit
      ] = target.resolvedTargets;

      switch (target.type) {
        case playSuccessType:
          io.emit('message', {
            message: `Now Playing: ${target.payload.name}`,
            key: target.payload.path,
            severity: 'success'
          });
          io.emit('playerState', {
            running: playerState.running,
            paused: playerState.paused
          });
          break;
        case playFailType:
          io.emit('message', {
            message: `Failed to play: ${target.payload.name}`,
            key: target.payload.path,
            severity: 'error'
          });
          break;
        case resume:
          io.emit('message', {
            message: 'Playback resumed',
            key: 'playbackResumed',
            severity: 'success'
          });
          io.emit('playerState', {
            running: playerState.running,
            paused: playerState.paused
          });
          break;
        case pause:
          io.emit('message', {
            message: `Paused`,
            key: 'pause',
            severity: 'success'
          });
          io.emit('playerState', {
            running: playerState.running,
            paused: playerState.paused
          });
          break;
        case quit: 
          io.emit('message', {
            message: `Stopped`,
            key: 'stopped',
            severity: 'success'
          });
          console.log('running', playerState.omx.running);
          io.emit('playerState', {
            running: playerState.running,
            paused: playerState.paused
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
    (actions, storeActions) => [
      storeActions.queue.addItemAtEnd,
      storeActions.queue.addItemNext,
      storeActions.queue.removeItem,
      storeActions.queue.removeAllItems
    ],
    (actions, target, helpers) => {
      const queue = helpers.getStoreState().queue;
      const io = helpers.getState().io;
      
      io.emit('queue', helpers.getStoreState().queue)
      
      const [
        addItemAtEnd,
        addItemNext,
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
  ),
  
  onVolumeChange: thunkOn(
    (actions, storeActions) => [
      storeActions.player.volumeUp,
      storeActions.player.volumeDown
    ],
    (actions, target, helpers) => {
      const io = helpers.getState().io;
      const volume = helpers.getStoreState().player.volume;
      const [ volumeUp, volumeDown ] = target.resolvedTargets;
      
      switch (target.type) {
        case volumeUp:
          io.emit('message', {
            message: `Increased Volume to ${volume} dmbels`,
            key: 'increaseVol',
            severity: 'success'
          });
          break;
        case volumeDown:
          io.emit('message', {
            message: `Decreased Volume to ${volume} dmbels`,
            key: 'decreaseVol',
            severity: 'success'
          });
          break;
      
      };
      
    }
  )
  
};

module.exports = socketModel;
