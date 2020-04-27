const easyPeasy = require('easy-peasy');
const omx = require('node-omxplayer');
const { action, thunk, thunkOn } = easyPeasy;

const playerModel = {
  omx: omx(),
  volume: -4800,
  paused: false,
  running: false,
  
  play: thunk(async (actions, payload, helpers) => {
    const state = helpers.getState();
    return new Promise((resolve, reject) => {
      actions.updatePause(false);
      if (payload) {
        state.omx.newSource(payload.path, 'local', false, state.volume);
        actions.updateRunning(true);
        resolve();
      } else {
        actions.updateRunning(false);
        reject();
      }
    });
  }),
  
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
  
  // according to stackoverflow, omx volume controls result in +/- 300dmbel
  // https://stackoverflow.com/questions/33162820/adjust-audio-volume-level-with-cli-omxplayer-raspberry-pi#answer-40967467
  volumeUp: action(state => {
    state.omx.volUp();
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
  
  onSetActiveIndex: thunkOn(
    (actions, storeActions) => storeActions.queue.setActiveIndex,
    (actions, target, helpers) =>
      actions.play(helpers.getStoreState().queue.nowPlaying)
  )
};

module.exports = playerModel;
