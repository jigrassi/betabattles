define(function() {

    return class ClientState {
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

        updateReadyState(readyStateMap) {
            this.readyState = readyStateMap.self;
            this.oppReadyState = readyStateMap.opp;
        }

        updateUsernames(usernameMap) {
            this.oppUsername = usernameMap.opp;
        }

        updateSelfUsername(username) {
            this.myUsername = username;
        }
    }
});