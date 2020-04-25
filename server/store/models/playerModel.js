const easyPeasy = require('easy-peasy');
const omx = require('node-omxplayer');
const { thunk, thunkOn } = easyPeasy;

const playerModel = {
  omx: omx(),
  volume: -4000,
  
  play: thunk(async (actions, payload, helpers) => {
    const state = helpers.getState();
    return new Promise((resolve, reject) => {
      if (payload) {
        state.omx.newSource(payload.path, 'local', false, state.volume);
        resolve();
      } else {
        reject();
      }
    });
  }),
  
  onSetActiveIndex: thunkOn(
    (actions, storeActions) => storeActions.queue.setActiveIndex,
    (actions, target, helpers) => 
      actions.play(helpers.getStoreState().queue.nowPlaying)
  )
};

module.exports = playerModel;
