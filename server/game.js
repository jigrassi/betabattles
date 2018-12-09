module.exports = {

    p1: null,
    p2: null,
    serverState: null,
    playersById: new Map(),
    tickInterval: null,

    init: function(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.playersById[p1.id] = p1;
        this.playersById[p2.id] = p2;
        ServerState = require('./ServerState.js');
        this.serverState = new ServerState();
        this.tickInterval = setInterval(function () {this.tick()}.bind(this), 1000); // bind is magical
    },

    gamestart: function() {
        this.p1.emit('gamestart');
        this.p2.emit('gamestart');
    },

    increaseIncome(id) {
        player = this.playersById[id];
        this.serverState.increaseIncome(id);
        player.emit('update', this.serverState.createPlayerState());
    },

    increaseArmy(id) {
        player = this.playersById[id];
        this.serverState.increaseArmy(id);
        player.emit('update', this.serverState.createPlayerState());
    },

    setArmyStance(id, stance) {
        player = this.playersById[id];
        this.serverState.setArmyStance(id, stance);
        this.p1.emit('update', this.serverState.createPlayerState());
        this.p2.emit('update', this.serverState.createPlayerState());
    },

    tick: function() {
        this.serverState.tick();
        this.p1.emit('update', this.serverState.createPlayerState());
        this.p2.emit('update', this.serverState.createPlayerState());   
    },

    disconnect_all: function() {
        console.log('disconnected both');
        clearInterval(this.tickInterval);
        this.p1.emit('dc');
        this.p2.emit('dc');
    }
}