const easyPeasy = require('easy-peasy');
const { action, thunk, thunkOn } = easyPeasy;
const directoryTree = require('directory-tree');

const libraryModel = {
  music: {},
  
  setMusic: action((state, payload) => {
    state.music = payload;
  }),
  
  getMusic: thunk((actions, payload, helpers) => {
    return new Promise((resolve, reject) => {
      try {
        const tree = directoryTree(payload);
        actions.setMusic(tree);
        resolve(tree);
      } catch(err){
        reject(err);
      };
    });
  }),
  
  
};

module.exports = libraryModel;
