let game = require("../game.js");
let dummyFuncOneArg = function(dummyArg) {};
let dummyFuncTwoArgs = function(arg1, arg2) {};
let p1 = {'name': 'playerOne', 'id': 'p1', 'emit': dummyFuncOneArg, 'update': dummyFuncTwoArgs};
let p2 = {'name': 'playerTwo', 'id': 'p2', 'emit': dummyFuncOneArg, 'update': dummyFuncTwoArgs};
let testNumber = 0;

function assert(condition) {
	let result = condition ? 'passed' : 'FAILED';
	console.log(`Test ${testNumber} ${result}`);
	testNumber++;
}

game.init(p1, p2);

for (var i = 0; i < 10; i++) {
	game.serverState.tick();
	game.serverState.tick();
	game.increaseIncome(p1.id);
	game.serverState.tick();
	game.increaseArmy(p1.id);
}
game.setArmyStance(p1.id, 'aggressive');
for (var i = 0; i < 10; i++) {
	game.serverState.tick();
}

assert(Math.abs(game.serverState.players[1].base - 62) < Math.pow(10, -10));

for (var i = 0; i < 16; i++) {
	game.serverState.tick();
}

assert(game.serverState.players[1].base > 0 && game.serverState.gameEnd == false);

game.serverState.tick();
game.serverState.tick(); // this is a bug: gameEnd should be set to true on first tick

assert(game.serverState.players[1].base < 0 && game.serverState.gameEnd == true);


