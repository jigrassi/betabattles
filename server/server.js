const Game = require('./game');
const ReadyCheck = require('./ready-check');
const ConnectionHub = require('./connectionhub').Instance();

// The "Do Everything" Game Server
// Handles tracking players and matchmaking logic
// Creates Game instances
// Passes messages through to the game given the playerId
class Server {
    constructor() {
        this.waitingPlayerId = -1;
        this.gameLookup = new Map();
        this.readyCheckLookup = new Map();
    }

    join(playerId) {
        console.log(`playerId ${playerId} connected`);
        if (this.waitingPlayerId === -1) {
            console.log('waiting on the bench');
            this.waitingPlayerId = playerId;
            return;
        }

        const newReadyCheck = new ReadyCheck();
        newReadyCheck.addUsers([this.waitingPlayerId, playerId]);

        this.readyCheckLookup.set(this.waitingPlayerId, newReadyCheck);
        this.readyCheckLookup.set(playerId, newReadyCheck);

        this.clearWaiting();
    }

    setReadyState(playerId, isReady) {
        const readyCheck = this.readyCheckLookup.get(playerId);
        readyCheck.setReadyState(playerId, isReady);

        if (readyCheck.allReady()) {
            const playerIds = readyCheck.getUsernames();
            const game = new Game(playerIds, ConnectionHub);

            playerIds.forEach((playerId) => {
                this.gameLookup.set(playerId, game);
            })
        }
    }

    clearWaiting() {
        this.waitingPlayer = -1;
    }

    disconnect(playerId) {
        console.log(`player ${playerId} disconnected`);
        let game = this.gameLookup.get(playerId);
        if (game != null) {
            game.disconnectAll();
        }
        this.gameLookup.delete(playerId);
        if (this.waitingPlayer == player) {
            this.clearWaiting();
        }
    }

    move(playerId, moveInfo) {
        let game = this.gameLookup.get(playerId);
        switch(moveInfo.moveName) {
            case 'increaseIncome':
                game.increaseIncome(playerId);
                break;
            case 'increaseArmy':
                game.increaseArmy(playerId);
                break;
            case 'setArmyStance':
                game.setArmyStance(playerId, moveInfo.armyStance);
                break;
            case 'nuke':
                game.nuke(playerId);
                break;
        }
    }
}

module.exports = Server;