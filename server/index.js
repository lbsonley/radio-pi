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
  console.log('remote connected');
  socket.on('disconnect', function() {
    console.log('disconnected');
  });

  // Send data every time a connection occurs
  actions.library.getMusic('/home/pi/Music');
  io.emit('queue', store.getState().queue);
  io.emit('playerState', {
    running: store.getState().player.omx.running,
    paused: store.getState().player.paused
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
    switch (payload.type) {
      case 'play':
        console.log('control type: play');
        actions.player.play(store.getState().queue.nowPlaying)
        break;
      case 'resume':
        console.log('control type: resume');
        actions.player.resume();
        break;
      case 'pause':
        actions.player.pause()
        break;
      case 'playNext':
        actions.queue.setActiveIndex(store.getState().queue.activeIndex + 1);
        break;
      case 'playPrevious':
        actions.queue.setActiveIndex(store.getState().queue.activeIndex - 1);
        break;
      case 'volumeUp':
        actions.player.volumeUp();
        break;
      case 'volumeDown':
        actions.player.volumeDown();
        break;
      case 'forward30':
        actions.player.forward30();
        break;
      case 'backward30':
        actions.player.backward30();
        break;
      default:
        console.log('control action not executed', type, path, name);
        return;
    }
  });

});

