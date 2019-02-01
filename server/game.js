const ConnectionHub = require('./ConnectionHub.js').Instance();
const ServerState = require('./ServerState.js');

class Game {
    constructor(p1Id, p2Id) {
        this.tickInterval = null;
        // TODO: gather player state into one source
        this.playersById = new Map();
        this.readyById = new Map();
        this.usernameById = new Map();
        this.p1Id = p1Id;
        this.p2Id = p2Id;
        this.readyById[p1Id] = false;
        this.readyById[p2Id] = false;
        this.usernameById[p1Id] = '';
        this.usernameById[p2Id] = '';
        
        // server state is redundant, move server state logic back into Game
        this.serverState = new ServerState();

        ConnectionHub.emit(this.p1Id, 'matched');
        ConnectionHub.emit(this.p2Id, 'matched');

        console.log(this.p1Id + " matched against " + this.p2Id);
    }

    gamestart() {
        ConnectionHub.emit(this.p1Id, 'gamestart');
        ConnectionHub.emit(this.p2Id, 'gamestart');
        // bind is needed for tick to have the right 'this' reference
        this.tickInterval = setInterval(function () {this.tick()}.bind(this), 500);
        console.log(this.p1Id + " playing against " + this.p2Id);
    }

    increaseIncome(id) {
        let player_index = (id == this.p1Id) ? 0 : 1;
        this.serverState.increaseIncome(player_index);
        ConnectionHub.emit(id, 'update', this.serverState.createPlayerState(player_index));
    }

    increaseArmy(id) {
        let player_index = id == this.p1Id ? 0 : 1;
        this.serverState.increaseArmy(player_index);
        ConnectionHub.emit(id, 'update', this.serverState.createPlayerState(player_index));
    }

    setArmyStance(id, stance) {
        let player_index = id == this.p1Id ? 0 : 1;
        this.serverState.setArmyStance(player_index, stance);
        ConnectionHub.emit(this.p1Id, 'update', this.serverState.createPlayerState(0));
        ConnectionHub.emit(this.p2Id, 'update', this.serverState.createPlayerState(1));
    }

    nuke(id) {
        let player_index = id == this.p1Id ? 0 : 1;
        this.serverState.nuke(player_index);
        ConnectionHub.emit(id, 'update', this.serverState.createPlayerState(player_index));
    }

    setReadyState(id, readyState) {
        this.readyById[id] = readyState;

        if(this.readyById[this.p1Id] && this.readyById[this.p2Id]){
            this.gamestart();
        } else {
            ConnectionHub.emit(this.p1Id, 'ready', {self: this.readyById[this.p1Id], opp: this.readyById[this.p2Id]});
            ConnectionHub.emit(this.p2Id, 'ready', {self: this.readyById[this.p2Id], opp: this.readyById[this.p1Id]});
        }
    }

    setUsername(id, username) {
        this.usernameById[id] = username;
        ConnectionHub.emit(this.p1Id, 'username', {self: this.usernameById[this.p1Id], opp: this.usernameById[this.p2Id]});
        ConnectionHub.emit(this.p2Id, 'username', {self: this.usernameById[this.p2Id], opp: this.usernameById[this.p1Id]});
    }

    tick() {
        this.serverState.tick();
        ConnectionHub.emit(this.p1Id, 'update', this.serverState.createPlayerState(0));
        ConnectionHub.emit(this.p2Id, 'update', this.serverState.createPlayerState(1));

        if(this.serverState.gameEnd) {
            clearInterval(this.tickInterval);
            setTimeout(function () {this.restartGame()}.bind(this), 3000);
        }
    }

    restartGame() {
        this.serverState.restart();
        setTimeout(function () {this.gamestart()}.bind(this), 1000);
    }

    disconnect_all() {
        console.log('disconnected both');
        clearInterval(this.tickInterval);
        ConnectionHub.emit(this.p1Id, 'dc');
        ConnectionHub.emit(this.p2Id, 'dc');
    }
}

module.exports = Game