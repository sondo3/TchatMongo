


var db = require('./db');


/**
 * External Module dependencies.
 */

//require.paths.unshift(__dirname + '/../../lib/');
var app = require('express')()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);



  app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

//, io = require('socket.io').listen(server);

server.listen(3000, function () {
 var addr = server.address();
  console.log('app listening on '+ addr.address + ':' + addr.port);
});
/* App configuration.
 */

// app.configure(function () {
//   //app.use(stylus.middleware({ src: __dirname + '/public', compile: compile }))
//   app.use(express.static(__dirname + '/public'));
//   app.set('views', __dirname);
//   app.set('view engine', 'jade');
// });


/**
 * Socket.IO server (single process only)
 */
var messages = []; 
var nicknames = [];

//messages = [{ nick :"message1",msg:" messages  test ecou"}]; 
io.sockets.on('connection', function (socket) {

	if (messages.length > 0) {

		for (i in messages) {
			socket.emit('announcement', messages[i].nick + ': ' + messages[i].msg);
		}
	}

  socket.on('user message', function (msg) {

		if (messages.length > 5) {
			messages = messages.slice(messages.length-5, messages.length);
		}
		messages.push({nick: socket.nickname, msg: msg});

    socket.broadcast.emit('user message', socket.nickname, msg);
  });

  socket.on('nickname', function (nick, fn) {

  	console.log(nicknames);

		var new_user = new db.User();
		new_user.nick = nick; 
		console.log("DEBUT"+new_user); 
		console.log(new_user.nick);
		new_user.save(function(err) {
			if (err) {
		console.log("DEBUB"+new_user); 
				fn(true);
			} else {
				console.log("Erreur"+nick);
				fn(false);
				for( var i in nicknames){
					socket.emit('announcement',nicknames[i] + 'connected');
				}

				nicknames[nick] = socket.nickname = nick;
				socket.broadcast.emit('announcement', nick + ' connected');
	      		io.sockets.emit('nicknames', nicknames);
			}
		});
  });

  socket.on('disconnect', function () {
    if (!socket.nickname) return;

		// TODO: mark as disconnected in DB

    delete nicknames[socket.nickname];

		var conditions = { nick: socket.nickname }
		  , update = { connected: false, last_connected: new Date() }
		  , options = { multi: false }
		  , callback = null;

		db.User.update(conditions, update, options, function(err) {

			if (err) {
				console.warn('Updating disconnected user record failed');
			}
		});

    socket.broadcast.emit('announcement', socket.nickname + ' disconnected');
    socket.broadcast.emit('nicknames', nicknames);
  });
});

