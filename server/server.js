const Game = require('./Game.js');
const ConnectionHub = require('./ConnectionHub.js').Instance();

class Server {
    constructor() {
        this.waiting_player = -1;
        this.game_lookup = new Map();
    }
    // player here is a socket connection instance
    join(player) {
        console.log(`player ${player.id} connected`);
        if (this.waiting_player === -1) {
            console.log('waiting on the bench');
            this.waiting_player = player;
            return;
        }
        let game = new Game(this.waiting_player.id, player.id, ConnectionHub);
        this.game_lookup.set(this.waiting_player.id, game);
        this.game_lookup.set(player.id, game);
        this.clear_waiting();
    }

    setReadyState(player, ready) {
        let game = this.game_lookup.get(player.id);
        if(game != null) {
            game.setReadyState(player.id, ready);
        }
    }

    setUsername(player, username) {
        let game = this.game_lookup.get(player.id);
        if(game != null) {
            game.setUsername(player.id, username);
        }
    }

    clear_waiting() {
        this.waiting_player = -1;
    }

    disconnect(player) {
        console.log(`player ${player.id} disconnected`);
        let game = this.game_lookup.get(player.id);
        if (game != null) {
            game.disconnectAll();
        }
        this.game_lookup.delete(player.id);
        if (this.waiting_player == player) {
            this.clear_waiting();
        }
    }

    move(player, moveInfo) {
        let game = this.game_lookup.get(player.id);
        switch(moveInfo.moveName) {
            case 'increaseIncome':
                game.increaseIncome(player.id);
                break;
            case 'increaseArmy':
                game.increaseArmy(player.id);
                break;
            case 'setArmyStance':
                game.setArmyStance(player.id, moveInfo.armyStance);
                break;
            case 'nuke':
                game.nuke(player.id);
                break;
        }
    }
}

module.exports = Server;