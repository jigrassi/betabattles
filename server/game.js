module.exports = {

    p1: null,
    p2: null,
    serverState: null,
    playersById: new Map(),

    init: function(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.playersById[p1.id] = p1;
        this.playersById[p2.id] = p2;
        ServerState = require('./ServerState.js');
        this.serverState = new ServerState();
    },

    fuck: function(x) {
        this.p1.emit('fuck', x - 1);
        this.p2.emit('fuck', x);
    },

    setArmyStance(id, stance) {
        player = this.playersById[id];
        serverState.setPlayerArmyStance(id, stance);
        p1.emit('update', serverState.createPlayerState());
        p2.emit('update', serverState.createPlayerState());
    },

    increaseIncome(id) {
        player = this.playersById[id];
        serverState.increaseIncome(id);
        player.emit('update', serverState.createPlayerState());
    },

    increaseArmy(id) {
        player = this.playersById[id];
        serverState.increaseArmy(id);
        player.emit('update', serverState.createPlayerState());
    },

    disconnect_all: function() {
        console.log('disconnected both');
        this.p1.emit('dc');
        this.p2.emit('dc');
    }
}