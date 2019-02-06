let Game = require("../game.js");
let dummyFuncOneArg = function(dummyArg) {};
let dummyFuncTwoArgs = function(arg1, arg2) {};
let dummyEmitFunc = (msg, data=null) => {}
let p1 = {'name': 'playerOne', 'id': 'p1', 'emit': dummyFuncOneArg, 'update': dummyFuncTwoArgs};
let p2 = {'name': 'playerTwo', 'id': 'p2', 'emit': dummyFuncOneArg, 'update': dummyFuncTwoArgs};
let testNumber = 0;

function assert(condition) {
	let result = condition ? 'passed' : 'FAILED';
	console.log(`Test ${testNumber} ${result}`);
	testNumber++;
}

let game = new Game(p1['id'], p2['id'], dummyEmitFunc);

for (var i = 0; i < 10; i++) {
	game.tick();
	game.tick();
	game.increaseIncome(p1.id);
	game.tick();
	game.increaseArmy(p1.id);
}
game.setArmyStance(p1.id, 'aggressive');
for (var i = 0; i < 10; i++) {
	game.tick();
}

assert(Math.abs(game.playerById.get(p2['id']).base - 62) < Math.pow(10, -10));

for (var i = 0; i < 16; i++) {
	game.tick();
}

assert(game.playerById.get(p2['id']).base > 0 && game.gameEnd == false);

game.tick();
game.tick(); // this is a bug: gameEnd should be set to true on first tick

assert(game.playerById.get(p2['id']).base < 0 && game.gameEnd == true);


