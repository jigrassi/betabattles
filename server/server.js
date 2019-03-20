const Game = require('./game');
const ReadyCheck = require('./ready-check');
const ConnectionHub = require('./connection-hub').Instance();

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

        ConnectionHub.emit(this.waitingPlayerId, 'matched');
        ConnectionHub.emit(playerId, 'matched');
        this.clearWaiting();
    }

    setReadyState(playerId, isReady) {
        const readyCheck = this.readyCheckLookup.get(playerId);
        readyCheck.setReadyState(playerId, isReady);

        const playerIds = readyCheck.getUsernames();

        if (readyCheck.allReady()) {
            const game = new Game(playerIds, ConnectionHub);

            playerIds.forEach((id) => {
                this.gameLookup.set(id, game);
            });

            game.gamestart();

            this.clearReadyCheck(playerId);
        }

        playerIds.forEach((id) => {
            if (id != playerId) {
                ConnectionHub.emit(id, 'ready', isReady);
            }
        });
    }

    clearWaiting() {
        console.log('clear waiting player');
        this.waitingPlayerId = -1;
    }

    clearGame(playerId) {
        if (this.gameLookup.has(playerId)) {
            const game = this.gameLookup.get(playerId);
            game.disconnectAll();
            game.getPlayerIds().forEach((playerId) => {
                this.gameLookup.delete(playerId);
            });
        }
    }

    clearReadyCheck(playerId) {
        if (this.readyCheckLookup.has(playerId)) {
            const readyCheck = this.readyCheckLookup.get(playerId);
            readyCheck.getUsernames().forEach((playerId) => {
                console.log(`player ${playerId} removed from readyCheckLookup`);
                this.readyCheckLookup.delete(playerId);
            });
        }
    }

    disconnect(playerId) {
        console.log(`player ${playerId} disconnected`);
        // TODO: need to disconnect both players no matter what...
        // crashes if disconnect in lobby and other person tries to ready up
        this.clearGame(playerId);
        this.clearReadyCheck(playerId);

        if (this.waitingPlayerId == playerId) {
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