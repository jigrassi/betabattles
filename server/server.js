module.exports = {
    waiting_player: -1,
    game_lookup: new Map(),

    // player here is a socket connection instance
    join: function(player) {
        console.log(`player ${player.id} connected`);
        if (this.waiting_player === -1) {
            console.log('waiting on the bench');
            this.waiting_player = player;
            return;
        }
        var game = require('./game.js');
        this.game_lookup.set(this.waiting_player.id, game);
        this.game_lookup.set(player.id, game);

        game.init(this.waiting_player, player);
        this.clear_waiting();
    },

    setReadyState: function(player, ready) {
        game = this.game_lookup.get(player.id);
        if(game != null) {
            game.setReadyState(player.id, ready);
        }
    },

    setUsername: function(player, username) {
        game = this.game_lookup.get(player.id);
        if(game != null) {
            game.setUsername(player.id, username);
        }
    },

    clear_waiting: function() {
        this.waiting_player = -1;
    },

    disconnect: function(player) {
        console.log(`player ${player.id} disconnected`);
        game = this.game_lookup.get(player.id);
        if (game != null) {
            game.disconnect_all();
        }
        this.game_lookup.delete(player.id);
        if (this.waiting_player == player) {
            this.clear_waiting();
        }
    },

    move: function(player, moveInfo) {
        game = this.game_lookup.get(player.id);
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
};
