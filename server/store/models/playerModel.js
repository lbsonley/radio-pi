const easyPeasy = require('easy-peasy');
const omx = require('node-omxplayer');
const { action, thunk, thunkOn } = easyPeasy;

const playerModel = {
  /**
   * State
   */
   
  omx: omx(),
  volume: -4800,
  paused: false,
  running: false,
  
  /**
   * Actions
   */
  
  updatePause: action((state, payload) => {
    state.paused = payload;
  }),
  
  updateRunning: action((state, payload) => {
    state.running = payload;
  }),
  
  resume: action(state => {
    state.paused = false;
    state.omx.play();
  }),
  
  pause: action(state => {
    state.paused = true;
    state.omx.pause();
  }),
  
  forward30: action(state => {
    state.omx.fwd30();
  }),
  
  backward30: action(state => {
    state.omx.back30();
  }),
  
  volumeUp: action(state => {
    state.omx.volUp();
    // according to stackoverflow, omx volume controls result in +/- 300dmbel
    // https://stackoverflow.com/questions/33162820/adjust-audio-volume-level-with-cli-omxplayer-raspberry-pi#answer-40967467
    state.volume += 300;
  }),
  
  volumeDown: action(state => {
    state.omx.volDown();
    state.volume -= 300;
  }),
  
  quit: action(state => {
    state.paused = false;
    state.running = false;
    state.omx.quit();
  }),
  
  /**
   * Thunks
   */
   
  handlePlaybackEnd: thunk((actions, payload, { getState, getStoreState, getStoreActions }) => {
    actions.updateRunning(false);
    actions.updatePause(false);
    getStoreState().socket.io.emit('playerState', {
      running: getState().running,
      paused: getState().paused
    });
    getStoreActions().queue.skipTrack(getStoreState().queue.activeIndex + 1);
  }),
  
  play: thunk(async (actions, payload, helpers) => {
    const state = helpers.getState();
    
    // remove event listener from previous call to play()
    state.omx.off('close', actions.handlePlaybackEnd);

    return new Promise((resolve, reject) => {
      actions.updatePause(false);
      if (payload) {
        state.omx.newSource(payload.path, 'local', false, state.volume);
        actions.updateRunning(true);
        
        // play next track on playback end
        state.omx.on('close', actions.handlePlaybackEnd);
        
        resolve();
      } else {
        actions.updateRunning(false);
        reject();
      }
    });
  }),
  
  /**
   * Listeners
   */
  
  onTrackChange: thunkOn(
    (actions, storeActions) => [
      storeActions.queue.skipTrack.successType,
      storeActions.queue.skipTrack.failType
    ],
    (actions, target, { getState, getStoreState }) => {
      const [
        skipTrackSuccess,
        skipTrackFail
      ] = target.resolvedTargets;
      
      const state = getState();
      
      switch (target.type) {
        case skipTrackSuccess:
          actions.play(getStoreState().queue.nowPlaying);
          break;
        case skipTrackFail:
          console.log('could not play that index', target.payload);
          break;
        default:
          return;
      };
      }
  ),
  
  onSetTrack: thunkOn(
    (actions, storeActions) => storeActions.queue.setTrack,
    (actions, target, { getState, getStoreState }) => {
      actions.play(getStoreState().queue.nowPlaying);
    }
  ),
  
  onAddItemNextAndPlay: thunkOn(
    (actions, storeActions) => storeActions.queue.addItemNextAndPlay,
    (actions, target, { getState, getStoreState }) => {
      actions.play(getStoreState().queue.nowPlaying);
    }
  )
};

module.exports = playerModel;
