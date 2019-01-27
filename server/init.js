module.exports = function(router, io) {
    var server = require('./server.js');

    io.of('/betabattles').on('connection', function(socket){
        server.join(socket);

        socket.on('disconnect', function() {
            server.disconnect(socket);
        });

        socket.on('ready', function(readyState) {
            server.setReadyState(socket, readyState);
        });

        socket.on('username', function(username) {
            server.setUsername(socket, username);
        });

        socket.on('move', function(moveInfo) {
            server.move(socket, moveInfo);
        })
    });
}
