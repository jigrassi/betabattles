class ClientState {
    constructor(server) {
        this.income = 5;
        this.funds = 0;
        this.myArmy = 0;
        this.oppArmy = 'unknown';
        this.myArmyStance = 'passive'; //'aggressive'
        this.oppArmyStance = 'passive';
        this.myBase = 100;
        this.oppBase = 100;
        this.readyState = false;
        this.oppReadyState = false;
        this.myUsername = '';
        this.oppUsername = '';
        this.oppPresent = false;
        this.youWin = false;
        this.gameEnd = false;
        this.myWins = 0;
        this.oppWins = 0;
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
        this.youWin = playerState.youWin;
        this.gameEnd = playerState.gameEnd;
        this.myWins = playerState.myWins;
        this.oppWins = playerState.oppWins;
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

    updateReadyState(readyStateMap) {
        this.readyState = readyStateMap.self;
        this.oppReadyState = readyStateMap.opp;
    }

    updateUsernames(usernameMap) {
        this.myUsername = usernameMap.self;
        this.oppUsername = usernameMap.opp;
    }
}
export default ClientState;