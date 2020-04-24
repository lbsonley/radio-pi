const express = require('express');
const app = express();
const server = require('http').createServer(app);
const path = require('path');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const io = require('socket.io').listen(server);
const omx = require('node-omxplayer');
const cors = require('cors');
const fs = require('fs');
const directoryTree = require('directory-tree');

let player;
let remote;
let currentTrack;
let music;
let queue = {
  items: [],
  activeIndex: 0
};

// Config

app.set('port', process.env.TEST_PORT || 8080);
app.use(favicon(path.join(__dirname, '..', 'public/images/music.png')));
app.use(morgan('tiny'));
app.use(bodyParser());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'dist')));
app.use(cors());

// Routes

app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname, '..', '/dist/index.html'));
});

server.listen(app.get('port'), function() {
  console.log(`Express server listening on port ${app.get('port')}`);
});

// Socket
io.on('connection', async function(socket) {
  console.log('remote connected');

  socket.on('disconnect', function() {
    console.log('disconnected');
  });
  
  // handle player creation
  player = player || omx();

  // read music from filesystem and send it to app
  try {
    music = music || await getMusic('/home/pi/Music');
    // console.log(JSON.stringify(music, null, 2));
    io.emit('library', music);
    io.emit('queue', queue);
  } catch(err) {
    console.log(err);
  }

  socket.on('updateQueue', (payload) => {
    const { type, path, name } = payload;
    const { items, activeIndex } = queue

    switch(type) {
      case 'add':
        queue.items.push({ path, name });
        io.emit('message', {
          message: `Added to end of queue: ${name}`,
          key: path,
          severity: 'success'
        });
        break;
      case 'playNext':
        items.splice(activeIndex + 1, 0, { path, name });
        io.emit('message', {
          message: `Added next in queue: ${name}`,
          key: path,
          severity: 'success'
        });
        break;
      case 'clear':
        queue = { items: [], activeIndex: 0 };
        io.emit('message', {
          message: 'Cleared Queue',
          key: 'clear',
          severity: 'success'
        });
        break;
      default:
        console.log(type, path, name);
        return;
    };
    io.emit('queue', queue);
  });

  socket.on('control', function(payload) {
    console.log('control', payload.type, JSON.stringify(payload, null, 2));
    switch (payload.type) {
      case 'play':
        handlePlay();
        break;
      case 'stop':
        handleStop();
        break;
      case 'volume':
        handleVol(payload.direction);
        break;
      case 'forward30':
        player.running && player.fwd30();
        break;
      case 'backward30':
        player.running && player.back30();
        break;
      case 'skipNext':
        handleSkipNext();
        break;
      case 'skipPrevious':
        handleSkipPrevious();
      default:
        return;
    }
  });

  function handlePlaybackEnd() {
    queue.activeIndex = queue.activeIndex + 1;
    handlePlay();
  }

  function handlePlay() {
    const queueItem = queue.items[queue.activeIndex];
    if (queueItem) {
      player.newSource(queueItem.path, 'local', false, -500);
      player.once('close', handlePlaybackEnd);
      io.emit('message', {
        key: 'playing',
        severity: 'success',
        message: `Playing ${queueItem.name}`
      });
    } else {
      queue.activeIndex = 0;
      io.emit('message', {
        key: 'playing',
        severity: 'error',
        message: `Add some items to the queue`
      });
    }
  }

  function handleStop() {
    if (player.running) {
      player.quit();
    }

    io.emit('message', {
      severity: 'info',
      message: 'Stopped',
      key: 'stop'
    });
  }

  function handlePause() {
    if (player && player.running) {
      player.pause();
    }

    io.emit('message', {
      severity: 'info',
      message: 'Paused',
      key: 'pause'
    });
  }
  
  function handleSkipNext() {
    console.log('skip next');
  }
  
  function handleSkipPrevious() {
    console.log('skip previous');
  }

  function handleVol(direction) {
    if (player && player.running) {
      switch (direction) {
        case 'down':
          player.volDown();
          io.emit('message', {
            severity: 'info',
            message: 'Decreased Volume',
            key: 'decreaseVolume'});
          break;
        case 'up':
          player.volUp();
          io.emit('message', {
            severity: 'info',
            message: 'Increased Volume',
            key: 'increaseVolume'
          });
          break;
        default:
          return;
      }
    }
  }


  function getMusic(dir) {
    return new Promise((resolve, reject) => {
      try {
        const tree = directoryTree(dir);
        resolve(tree);
      } catch(err){
        reject(err);
      };
    });
  }

});

