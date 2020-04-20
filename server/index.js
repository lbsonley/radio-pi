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

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, '..', '/public/remote.html'));
});

app.get('/remote', function(req, res) {
	res.sendFile(path.join(__dirname, '..',  '/dist/index.html'));
});

server.listen(app.get('port'), function() {
	console.log(`Express server listening on port ${app.get('port')}`);
});

// Socket

io.on('connection', function(socket) {
	console.log('remote connected');
	
	getMusic('/home/pi/Music')
		.then(nodes => {console.log(JSON.stringify(nodes, null, 2)); return nodes})
		.then(nodes => io.emit('library', { nodes }))
		.catch(err => console.log(err));
	
	if (player && player.running) {
		console.log('playing', currentTrack);
		io.emit('nowPlaying', { name: currentTrack });
	} else {
		io.emit('nowPlaying', { name: '' });
	}
	
	if (player) {
		
	}

	socket.on('disconnect', function() {
		console.log('disconnected');
	});
	
	socket.on('remote', function(data) {
		console.log('remote ready');
		io.emit('synced');
	});
	
	socket.on('control', function(data) {
		console.log('control', data.action, JSON.stringify(data, null, 2));
		switch (data.action) {
			case 'play':
				handlePlay(data.path, data.name);
				break;
			case 'download':
				// handleDownload(data.id);
				break;
			case 'stop':
				handleStop();
				break;
			case 'pause':
				handlePause();
				break;
			case 'volume':
				handleVol(data.direction);
				break;
			case 'forward30':
				player && player.running && player.fwd30();
				break;
			case 'forward600':
				player && player.running && player.fwd600();
				break;
			case 'back30':
				player && player.running && player.back30();
				break;
			case 'back600':
				player && player.running && player.back600();
				break;
			default:
				return;
		}
	});

	function handlePlaybackEnd() {
		console.log('player closed');
		io.emit('player closed');
	}
	
	function handlePlay(filePath, name) {
		if (player && player.running && currentTrack === filePath) {
			handlePause();
		}
		else if(player && player.running && currentTrack !== filePath)  {
			player.newSource(filePath)
			io.emit('nowPlaying', { name });
		} else {
			player = omx(filePath);
			player.on('close', handlePlaybackEnd);
			io.emit('nowPlaying', { name });
		}
		
		currentTrack = filePath;
	}
	
	function handleStop() {
		if (player && player.running) player.quit();
		io.emit('statusMessage', { msg: 'Stopped Playback' });
	}
	
	function handlePause() {
		if (player && player.running) player.pause();
		io.emit('statusMessage', { msg: 'Paused Playback' });
	}
	
	function handleVol(direction) {
		if (player && player.running) {
			switch (direction) {
				case 'down':
					player.volDown();
					io.emit('statusMessage', { msg: 'Decreased Volume' });
					break;
				case 'up':
					player.volUp();
					io.emit('statusMessage', { msg: 'Increased Volume' });
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

