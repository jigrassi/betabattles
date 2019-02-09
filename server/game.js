const Player = require('./player.js');

class Game {
    constructor(p1Id, p2Id, msgSender) {
        console.log('constructing game');
        this.tickInterval = null;
        // TODO: gather player state into one source
        this.playerById = new Map();
        this.playerById.set(p1Id, new Player());
        this.playerById.set(p2Id, new Player());

        this.readyById = new Map();
        this.usernameById = new Map();
        this.p1Id = p1Id;
        this.p2Id = p2Id;
        // TODO: fix these misuses of Map type
        this.readyById[p1Id] = false;
        this.readyById[p2Id] = false;
        this.usernameById[p1Id] = '';
        this.usernameById[p2Id] = '';
        this.gameEnd = false;
        this.msgSender = msgSender;

        this.msgSender.emit(this.p1Id, 'matched');
        this.msgSender.emit(this.p2Id, 'matched');

        console.log(this.p1Id + " matched against " + this.p2Id);
    }

    gamestart() {
        this.msgSender.emit(this.p1Id, 'gamestart');
        this.msgSender.emit(this.p2Id, 'gamestart');
        // bind is needed for tick to have the right 'this' reference
        this.tickInterval = setInterval(function () {this.tick()}.bind(this), 500);
        console.log(this.p1Id + " playing against " + this.p2Id);
    }

    increaseIncome(id) {
        this.playerById.get(id).increaseIncome();
        this.updatePlayerState(id);
    }

    increaseArmy(id) {
        this.playerById.get(id).increaseArmy();
        this.updatePlayerState(id);
    }

    setArmyStance(id, stance) {
        this.playerById.get(id).setArmyStance(stance);
        this.updatePlayerState(id);
        this.updatePlayerState(this.getOpponentId(id));
    }

    nuke(id) {
        let player = this.playerById.get(id);
        if (player.funds < 100) {
            return;
        }
        player.funds -= 100;
        let opponent = this.getOpponent(id);
        opponent.army = Math.floor(opponent.army / 2);
        this.updatePlayerState(id);
        this.updatePlayerState(this.getOpponentId(id));
    }

    setReadyState(id, readyState) {
        this.readyById[id] = readyState;

        if(this.readyById[this.p1Id] && this.readyById[this.p2Id]){
            this.gamestart();
        } else {
            this.msgSender.emit(this.p1Id, 'ready', {self: this.readyById[this.p1Id], opp: this.readyById[this.p2Id]});
            this.msgSender.emit(this.p2Id, 'ready', {self: this.readyById[this.p2Id], opp: this.readyById[this.p1Id]});
        }
    }

    setUsername(id, username) {
        this.usernameById[id] = username;
        this.msgSender.emit(this.p1Id, 'username', {self: this.usernameById[this.p1Id], opp: this.usernameById[this.p2Id]});
        this.msgSender.emit(this.p2Id, 'username', {self: this.usernameById[this.p2Id], opp: this.usernameById[this.p1Id]});
    }

    getOpponentId(id) {
        return (id == this.p1Id) ? this.p2Id : this.p2Id;
    }

    getOpponent(id) {
        return this.playerById.get(this.getOpponentId(id));
    }

    // TODO: this needs refactor
    tick() {
        // check game end
        let p1 = this.playerById.get(this.p1Id);
        let p2 = this.playerById.get(this.p2Id);
        if (p1.base <= 0 && p2.base <= 0) {
            this.gameEnd = true;
            this.winner = 'tie';
            p1.wins += 0.5;
            p1.wins += 0.5;
        } else if (p2.base <= 0) {
            this.gameEnd = true;
            this.winner = this.p1Id;
            p1.wins += 1;
        } else if (p1.base <= 0) {
            this.gameEnd = true;
            this.winner = this.p2Id;
            p2.wins += 1;
        }

        //console.log("tick : " + this.stateString());
        p1.funds += Math.round(p1.income); // * p1.base / 100);
        p2.funds += Math.round(p2.income); // * p2.base / 100);

        if(p1.stance == 'aggressive' && p2.stance == 'aggressive'){
            var player1damage = p1.army * 0.1;
            var player2damage = p2.army * 0.1;
            p1.army -= player2damage;
            if (p1.army < 0) {
                p1.base += p1.army;
                p1.army = 0;
            }
            p2.army -= player1damage;
            if (p2.army < 0) {
                p2.base += p2.army;
                p2.army = 0;
            }
        } else if (p1.stance == 'aggressive') {
            p2.base -= p1.army * 0.1;
        } else if (p2.stance == 'aggressive') {
            p1.base -= p2.army * 0.1;
        }

        this.playerById.forEach((_, player) => {
            if (player.army < 1 && player.stance != 'passive') {
                console.log('force to passive');
                player.stance = 'passive';
            }
        });

        this.updatePlayerState(this.p1Id);
        this.updatePlayerState(this.p2Id);

        if(this.gameEnd) {
            clearInterval(this.tickInterval);
            setTimeout(function () {this.restartGame()}.bind(this), 3000);
        }
    }

    restartGame() {
        this.restart();
        setTimeout(function () {this.gamestart()}.bind(this), 1000);
    }

    disconnectAll() {
        console.log('disconnected both');
        clearInterval(this.tickInterval);
        this.msgSender.emit(this.p1Id, 'dc');
        this.msgSender.emit(this.p2Id, 'dc');
    }

    restart() {
        this.playerById.get(this.p1Id).resetStats();
        this.playerById.get(this.p2Id).resetStats();
        this.gameEnd = false;
    }

    updatePlayerState(playerId) {
        this.msgSender.emit(playerId, 'update', this.createPlayerState(playerId));
    }

    createPlayerState(id) {
        let player = this.playerById.get(id);
        let opponent = this.getOpponent(id);

        return {
            funds: player.funds,
            income: player.income,
            myArmy: player.army,
            oppArmy: opponent.stance == 'aggressive' ? opponent.army : 'unknown',
            myArmyStance: player.stance,
            oppArmyStance: opponent.stance,
            myBase: player.base,
            oppBase: opponent.base,
            youWin: id == this.winner,
            gameEnd: this.gameEnd,
            myWins: player.wins,
            oppWins: opponent.wins
        };
    }

    stateString() {
        return JSON.stringify(this.playerById.get(this.p1Id)) + " : " +
            JSON.stringify(this.playerById.get(this.p2Id));
    }
}

module.exports = Game