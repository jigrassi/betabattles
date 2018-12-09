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
        // bind is needed for tick to have the right 'this' reference
        this.tickInterval = setInterval(function () {this.tick()}.bind(this), 1000);
        console.log(this.p1.id + " playing against " + this.p2.id);
    },

    gamestart: function() {
        this.p1.emit('gamestart');
        this.p2.emit('gamestart');
    },

    increaseIncome(id) {
        var player = this.playersById[id];
        var player_index = (player == this.p1) ? 0 : 1;
        this.serverState.increaseIncome(player_index);
        player.emit('update', this.serverState.createPlayerState(player_index));
    },

    increaseArmy(id) {
        var player = this.playersById[id];
        var player_index = player == this.p1 ? 0 : 1;
        this.serverState.increaseArmy(player_index);
        player.emit('update', this.serverState.createPlayerState(player_index));
    },

    setArmyStance(id, stance) {
        var player = this.playersById[id];
        var player_index = player == this.p1 ? 0 : 1;
        this.serverState.setArmyStance(player_index, stance);
        this.p1.emit('update', this.serverState.createPlayerState(0));
        this.p2.emit('update', this.serverState.createPlayerState(1));
    },

    tick: function() {
        this.serverState.tick();
        this.p1.emit('update', this.serverState.createPlayerState(0));
        this.p2.emit('update', this.serverState.createPlayerState(1));   
    },

    disconnect_all: function() {
        console.log('disconnected both');
        clearInterval(this.tickInterval);
        this.p1.emit('dc');
        this.p2.emit('dc');
    }
}