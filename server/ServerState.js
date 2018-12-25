module.exports = class ServerState {

    constructor() {
        this.players = [];
        var Player = require('./Player.js');
        this.players[0] = new Player();
        this.players[1] = new Player();
        this.gameEnd = false;
    }

    increaseIncome(index) {
        this.players[index].increaseIncome();
    }

    increaseArmy(index) {
        this.players[index].increaseArmy();
    }

    setArmyStance(index, stance) {
        this.players[index].setArmyStance(stance);
    }

    restart() {
        this.players[0].resetStats();
        this.players[1].resetStats();
        this.gameEnd = false;
    }

    tick() {
        // check game end
        if (this.players[0].base <= 0 && this.players[1].base <= 0) {
            this.gameEnd = true;
            this.winner = 'tie';
            this.players[0].wins += 0.5;
            this.players[0].wins += 0.5;
        } else if (this.players[1].base <= 0) {
            this.gameEnd = true;
            this.winner = 0;
            this.players[0].wins += 1;
        } else if (this.players[0].base <= 0) {
            this.gameEnd = true;
            this.winner = 1;
            this.players[1].wins += 1;
        }

        //console.log("tick : " + this.stateString());
        this.players[0].funds += Math.round(this.players[0].income); // * this.players[0].base / 100);
        this.players[1].funds += Math.round(this.players[1].income); // * this.players[1].base / 100);

        if(this.players[0].stance == 'aggressive' && this.players[1].stance == 'aggressive'){
            var player1damage = this.players[0].army * 0.1;
            var player2damage = this.players[1].army * 0.1;
            this.players[0].army -= player2damage;
            if (this.players[0].army < 0) {
                this.players[0].base += this.players[0].army;
                this.players[0].army = 0;
            }
            this.players[1].army -= player1damage;
            if (this.players[1].army < 0) {
                this.players[1].base += this.players[1].army;
                this.players[1].army = 0;
            }
        } else if (this.players[0].stance == 'aggressive') {
            this.players[1].base -= this.players[0].army * 0.1;
        } else if (this.players[1].stance == 'aggressive') {
            this.players[0].base -= this.players[1].army * 0.1;
        }

        for (var player of this.players) {
            if (player.army < 1 && player.stance != 'passive') {
                console.log('force to passive');
                player.stance = 'passive';
            }
        }
    }

    createPlayerState(index) {
        var you = this.players[index];
        var opponent = this.players[1 - index];
        var playerState = {
            funds: you.funds,
            income: you.income,
            myArmy: you.army,
            oppArmy: opponent.stance == 'aggressive' ? opponent.army : 'unknown',
            myArmyStance: you.stance,
            oppArmyStance: opponent.stance,
            myBase: you.base,
            oppBase: opponent.base,
            youWin: index == this.winner,
            gameEnd: this.gameEnd,
            myWins: you.wins,
            oppWins: opponent.wins
        }
        return playerState;
    }

    stateString() {
        return JSON.stringify(this.players[0]) + " : " + JSON.stringify(this.players[1]);
    }
};