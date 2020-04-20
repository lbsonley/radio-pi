// TODO => Setup Admin Dashboard for Adding Music
const spawn = require('child_process').spawn;
const path = require('path');

function runShell(cmd, args, cb, end) {
	const child = spawn(cmd, args);
	const me = this;
	
	child.stdout.on('data', function(buffer) {
		cb(me, buffer);
	});
	
	child.stdout.on('end', end);
}

const admin = ({ id, socket, omx }) => {
  function handleDownload(id) {
		const download = (me, buffer) => {
			me.stdout += buffer.toString();
			socket.emit('loading', buffer.length);
			console.log('stdout', me.stdout);
		};
		
		const play = () => {
			socket.emit('loaded');
			console.log(path.join(__dirname, '../..', 'Music', 'id.mp4'));
			omx.start(path.join(__dirname, '../..', 'Music', id + '.mp4'));
		};
		
		const url = `http://www.youtube.com/watch?v=${id}`;
		runShell(
			'youtube-dl',
			['-o', '~/Music/%(id)s.%(ext)s', '-f', 'mp4', url],
			download,
			play
		);
	}
}

module.exports = admin;
