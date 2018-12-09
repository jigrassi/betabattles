module.exports = {
    waiting_player: -1,
    game_lookup: {},

    // player here is a socket connection instance
    join: function(player) {
        console.log(`player ${player.id} connected`);
        if (this.waiting_player === -1) {
            console.log('waiting on the bench');
            this.waiting_player = player;
            return;
        }
        // console.log(this.waiting_player);
        console.log(`matched with player ${player.id}`);
        var game = require('./game.js');
        this.game_lookup[this.waiting_player.id] = game;
        this.game_lookup[player.id] = game;

        game.init(this.waiting_player, player);
        game.gamestart();
        this.clear_waiting();
    },

    increaseIncome : function(player) {
        game = this.game_lookup[player.id];
        game.increaseIncome(player.id);
    },

    increaseArmy: function(player) {
        game = this.game_lookup[player.id];
        game.increaseArmy(player.id);
    },

    setArmyStance: function(player, stance) {
        game = this.game_lookup[player.id];
        game.setArmyStance(player.id, stance);
    },

    clear_waiting: function() {
        this.waiting_player = -1;
    },

    disconnect: function(player) {
        this.game_lookup[player.id].disconnect_all();
    }
};
