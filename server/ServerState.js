module.exports = class ServerState {

    constructor() {
        const initialFunds = 0;
        const initialIncome = 5;
        var player1 = {funds: initialFunds, income: initialIncome, army: 0, stance: 'passive',  base: 100};
        var player2 = {funds: initialFunds, income: initialIncome, army: 0, stance: 'passive',  base: 100};
        this.players = [];
        this.players[0] = player1;
        this.players[1] = player2;
        this.gameEnd = false;       
    }

    increaseIncome(index) {
        var player = this.players[index];
        if(player.funds < 5) {
            return;
        }
        var newIncome = player.income;
        while (player.funds >= newIncome + 1) {
            newIncome += 1;
            player.funds -= newIncome;
        }
        player.income = newIncome;
    }

    increaseArmy(index) {
        var player = this.players[index];
        if(player.funds < 5) {
            return;
        }
        player.army += Math.floor(player.funds/5);
        player.funds %= 5;
    }

    setArmyStance(index, stance) {
        var player = this.players[index];
        if (player.army < 1) {
            return;
        }
        if(stance == 'passive') {
            player.stance = 'passive';
        } else if (stance == 'aggressive') {
            player.stance = 'aggressive';
        }
    }

    tick() {
        //console.log("tick : " + this.stateString());
        this.players[0].funds += this.players[0].income;
        this.players[1].funds += this.players[1].income;

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

        if (this.players[0].base <= 0 && this.players[1].base <= 0) {
            this.gameEnd = true;
        } else if (this.players[1].base <= 0) {
            this.gameEnd = true;
        } else if (this.players[0].base <= 0) {
            this.gameEnd = true;
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
            oppBase: opponent.base
        }
        return playerState;
    }

    stateString() {
        return JSON.stringify(this.players[0]) + " : " + JSON.stringify(this.players[1]);
    }
};