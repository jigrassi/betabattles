const Server = require('./server.js');
const ConnectionHub = require('./connectionhub.js').Instance();

module.exports = function(router, io) {
    const serverInstance = new Server();
    io.of('/betabattles').on('connection', function(socket){
        ConnectionHub.registerConnection(socket);
        serverInstance.join(socket);

        socket.on('disconnect', function() {
            serverInstance.disconnect(socket);
        });

        socket.on('ready', function(readyState) {
            serverInstance.setReadyState(socket, readyState);
        });

        socket.on('username', function(username) {
            serverInstance.setUsername(socket, username);
        });

        socket.on('move', function(moveInfo) {
            serverInstance.move(socket, moveInfo);
        })
    });
}
