module.exports = function(router, io) {
    var game = require('./game.js');

    io.on('connection', function(socket){
        game.join(socket, io.sockets.connected);
        socket.on('move', function(move) {
            game.move(socket, io.sockets.connected, move);
        });

        socket.on('disconnect', function() {
            game.exit(socket, io.sockets.connected);
        });

        socket.on('over', function() {
            game.rematch(socket, io.sockets.connected);
        })
    });
}
