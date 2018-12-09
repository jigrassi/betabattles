module.exports = function(router, io) {
    var server = require('./server.js');

    io.of('/betabattles').on('connection', function(socket){
        server.join(socket);

        socket.on('disconnect', function() {
            server.disconnect(socket);
        });
    });
}
