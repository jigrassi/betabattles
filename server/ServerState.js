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

    increaseFunds(id) {
        if(this.players[0].funds < 5) {
            return;
        }
        this.players[0].funds -= 5;
        this.players[0].income += 1;
    }

    increaseArmy(id) {
        if(this.players[0].funds < 5) {
            return;
        } 
        this.players[0].funds -= 5;
        this.players[0].army += 1;
    }

    setArmyStance(id, stance) {
        if(stance == 'passive') {
            this.players[0].stance = 'passive';
        } else if (stance == 'aggressive') {
            this.players[0].stance = 'aggressive';
        }
    }

    tick() {
        this.players[0].funds += this.players[0].income;
        this.players[1].funds += this.players[1].income;

        if(this.players[0].stance == 'aggressive' && this.players[1].stance == 'aggressive'){
            var player1damage = this.players[0].army * 0.1;
            var player2damage = this.players[1].army * 0.1;
            this.players[0].army -= player2damage;
            this.players[1].army -= player1damage;
        } else if (this.players[0].stance == 'aggressive') {
            this.players[1].base -= this.players[0].army * 0.1;
        } else if (this.players[1].stance == 'aggressive') {
            this.players[0].base -= this.players[1].army * 0.1;
        }

        if (this.players[0].base <= 0 && this.players[1].base <= 0) {
            this.gameEnd = true;
        } else if (this.players[1].base <= 0) {
            this.gameEnd = true;
        } else if (this.players[0].base <= 0) {
            this.gameEnd = true;
        }
        return this.createPlayerState();
    }

    createPlayerState() {
        var playerState = {
            funds: this.players[0].funds,
            income: this.players[0].income,
            myArmy: this.players[0].army,
            oppArmy: this.players[1].stance == 'aggressive' ? this.players[1].army : 'unknown',
            myArmyStance: this.players[0].stance,
            oppArmyStance: this.players[1].stance,
            myBase: this.players[0].base,
            oppBase: this.players[1].base
        }
        return playerState;
    }
};