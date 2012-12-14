
 
 socket.on('connect', function () {
	
  $('#chat').addClass('connected');
});


  socket.on('announcement', function (msg) {
  $('#lines').append($('<p>').append($('<em>').text(msg)));
});
  socket.on('#nicknames', function (nicknames) {
  $('#nicknames').empty().append($('<span>Online: </span>'));
  for (var i in nicknames) {
    $('#nicknames').append($('<b>').text(nicknames[i]));
  }
});




$(function () {
  $('#set-nickname').submit(function (ev) {
  	console.log(" je passe ");
    socket.emit('nickname', $('#nick').val(), function (set) {
      if (!set) {
        clear();
        return $('#chat').addClass('nickname-set');
      }
      $('#nickname-err').css('visibility', 'visible');
    });
    return false;
  });