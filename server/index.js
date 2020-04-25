const express = require('express');
const app = express();
const server = require('http').createServer(app);
const path = require('path');
const favicon = require('serve-favicon');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const socket = require('socket.io');
const omx = require('node-omxplayer');
const cors = require('cors');
const fs = require('fs');
const directoryTree = require('directory-tree');
const store = require('./store');
const actions = store.getActions();

actions.socket.setSocket(socket.listen(server));
const io = store.getState().socket.io;

actions.library.getMusic('/home/pi/Music');

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
  
  // Actions on new connection
  console.log('remote connected');
  actions.library.getMusic('/home/pi/Music');
  io.emit('queue', store.getState().queue);

  socket.on('disconnect', function() {
    console.log('disconnected');
  });

  socket.on('updateQueue', (payload) => {
    const { type, path, name } = payload;

    switch(type) {
      case 'addItemAtEnd':
        actions.queue.addItemAtEnd({ path, name });
        break;
      case 'addItemNext':
        actions.queue.addItemNext({ path, name });
        break;
      case 'removeItem':
        actions.queue.removeItem(payload.index);
        break;
      case 'removeAllItems':
        actions.queue.removeAllItems();
        break;
      case 'setActiveIndex':
        actions.queue.setActiveIndex(payload.index);
        break;
      case 'addItemNextAndPlay':
        actions.queue.addItemNextAndPlay({ name, path });
        break;
      
      default:
        console.log('updateQueue action not executed', type, path, name);
        return;
    };
  });

  socket.on('control', function(payload) {
    console.log('control', payload.type, JSON.stringify(payload, null, 2));
    switch (payload.type) {
      case 'play':
        actions.queue.player.omx.play(store.getState.queue.nowPlaying)
        break;
      case 'playNext':
        actions.queue.setActiveIndex(store.getState().queue.activeIndex + 1);
        break;
      case 'playPrevious':
        actions.queue.setActiveIndex(store.getState().queue.activeIndex - 1);
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
      default:
        return;
    }
  });

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

});

