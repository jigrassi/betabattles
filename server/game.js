"use strict";
module.exports = {

    p1: null,
    p2: null,
    serverState: null,
    playersById: new Map(),
    tickInterval: null,
    readyById: new Map(),
    usernameById: new Map(),

    init: function(p1, p2) {
        this.p1 = p1;
        this.p2 = p2;
        this.playersById[p1.id] = p1;
        this.playersById[p2.id] = p2;
        this.readyById[p1.id] = false;
        this.readyById[p2.id] = false;
        this.usernameById[p1.id] = '';
        this.usernameById[p2.id] = '';
        var ServerState = require('./ServerState.js');
        this.serverState = new ServerState();
        this.p1.emit('matched');
        this.p2.emit('matched');
        console.log(this.p1.id + " matched against " + this.p2.id);

    },

    gamestart: function() {
        this.p1.emit('gamestart');
        this.p2.emit('gamestart');
        // bind is needed for tick to have the right 'this' reference
        this.tickInterval = setInterval(function () {this.tick()}.bind(this), 500);
        console.log(this.p1.id + " playing against " + this.p2.id);
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

    setReadyState(id, readyState) {
        this.readyById[id] = readyState;

        if(this.readyById[this.p1.id] && this.readyById[this.p2.id]){
            this.gamestart();
        } else {
            this.p1.emit('ready', {self: this.readyById[this.p1.id], opp: this.readyById[this.p2.id]});
            this.p2.emit('ready', {self: this.readyById[this.p2.id], opp: this.readyById[this.p1.id]});
        }
    },

    setUsername(id, username) {
        this.usernameById[id] = username;
        this.p1.emit('username', {self: this.usernameById[this.p1.id], opp: this.usernameById[this.p2.id]});
        this.p2.emit('username', {self: this.usernameById[this.p2.id], opp: this.usernameById[this.p1.id]});
    },

    tick: function() {
        this.serverState.tick();
        if (this.serverState.gameEnd) {
            this.p1.emit('gameend', this.serverState.players[0].base > 0);
            this.p2.emit('gameend', this.serverState.players[1].base > 0);
            clearInterval(this.tickInterval);
        } else {
            this.p1.emit('update', this.serverState.createPlayerState(0));
            this.p2.emit('update', this.serverState.createPlayerState(1));
        }
    },

    disconnect_all: function() {
        console.log('disconnected both');
        clearInterval(this.tickInterval);
        this.p1.emit('dc');
        this.p2.emit('dc');
    }
}