var income;
var funds;
var myArmy;
var oppArmy;
var armyStance; //'passive', 'aggressive'
var oppArmyStance;
var myBase;
var oppBase;

class clientState {

    constructor(server) {
        this.income = 5;
        this.funds = 0;
        this.myArmy = 0;
        this.oppArmy = 'unknown';
        this.myArmyStance = 'passive'; //'aggressive'
        this.oppArmyStance = 'passive';
        this.myBase = 100;
        this.oppBase = 100;
        this.server = server;
    }

    update(playerState) {
        this.income = playerState.income;
        this.funds = playerState.funds;
        this.myArmy = playerState.myArmy;
        this.oppArmy = playerState.oppArmy;
        this.myArmyStance = playerState.myArmyStance;
        this.oppArmyStance = playerState.oppArmyStance;
        this.myBase = playerState.myBase;
        this.oppBase = playerState.oppBase;
    }

    setArmyStance(stance) {
        myArmyStance = stance;
        server.setPlayerStance(stance);
    }

    increaseIncome() {
        server.increasePlayerFunds();
    }

    increaseArmy() {
        server.increaseArmy();
    }
}