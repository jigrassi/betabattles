const Server = require('./server');
const ConnectionHub = require('./connection-hub').Instance();

module.exports = function(router, io) {
    const serverInstance = new Server();
    io.of('/betabattles').on('connection', function(socket){
        ConnectionHub.registerConnection(socket);
        serverInstance.join(socket.id);

        socket.on('disconnect', function() {
            serverInstance.disconnect(socket.id);
        });

        socket.on('ready', function(readyState) {
            serverInstance.setReadyState(socket.id, readyState);
        });

        socket.on('username', function(username) {
            serverInstance.setUsername(socket.id, username);
        });

        socket.on('move', function(moveInfo) {
            serverInstance.move(socket.id, moveInfo);
        })
    });
}
