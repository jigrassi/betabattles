module.exports = function(router, io) {
    var server = require('./server.js');

    io.of('/betabattles').on('connection', function(socket){
        server.join(socket);

        socket.on('disconnect', function() {
            server.disconnect(socket);
        });

        socket.on('increaseIncome', function() {
            server.increaseIncome(socket);
        });

        socket.on('increaseArmy', function() {
            server.increaseArmy(socket);
        });

        socket.on('setArmyStance', function(stance) {
            server.setArmyStance(socket, stance);
        });

        socket.on('ready', function(readyState) {
            server.setReadyState(socket, readyState);
        });

        socket.on('username', function(username) {
            server.setUsername(socket, username);
        });
    });
}
