const fs = require('fs');

async function getMusic () {
  const basePath = '/home/pi/Music';
  
  const promiseReadDir = path => new Promise((resolve, reject)) => {
    fs.readdir(path, (err, files) => err ? reject(err) : resolve(files));
  }
  
  async const walk = () => {
    results = {};
    try {
      const dirContent = await promiseReadDir(basePath);
      return dirContent;
    } catch(err) {
      console.log(err);
    }
  };
  
  const music = await walk();
  
  return music;
}

module.exports = getMusic;
