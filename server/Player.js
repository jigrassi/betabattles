class Player {
    constructor() {
        this.resetStats();
        this.wins = 0;
    }

    resetStats() {
        this.funds = 0;
        this.income = 5;
        this.army = 0;
        this.stance = 'passive';
        this.base = 100;
    }

    increaseIncome() {
        if(this.funds < 5) {
            return;
        }
        var newIncome = this.income;
        while (this.funds >= newIncome + 1) {
            newIncome += 1;
            this.funds -= newIncome;
        }
        this.income = newIncome;
    }

    increaseArmy() {
        if(this.funds < 5) {
            return;
        }
        this.army += Math.floor(this.funds/5);
        this.funds %= 5;
    }

    setArmyStance(stance) {
        if (this.army < 1) {
            return;
        }
        if(stance == 'passive') {
            this.stance = 'passive';
        } else if (stance == 'aggressive') {
            this.stance = 'aggressive';
        }
    }
}

module.exports = Player;