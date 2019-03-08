const Game = require("../game");

let emptyMsger = { emit: jest.fn() };
let p1 = { name: 'playerOne', id: 'p1' };
let p2 = { name: 'playerTwo', id: 'p2' };

test('full game sim, one sided offensive', () => {
	let game = new Game(p1['id'], p2['id'], emptyMsger);

	console.log('ticking and increasing p1 income and army');
	for (var i = 0; i < 10; i++) {
		game.tick();
		game.tick();
		game.increaseIncome(p1.id);
		game.tick();
		game.increaseArmy(p1.id);
	}

	console.log('p1 aggressive, continue ticking...');
	game.setArmyStance(p1.id, 'aggressive');
	for (var i = 0; i < 10; i++) {
		game.tick();
	}

	console.log('checking player base health');
	expect(Math.abs(game.playerById.get(p2['id']).base - 62) < Math.pow(10, -10)).toEqual(true);
	expect(game.playerById.get(p1['id']).base).toEqual(100);

	console.log('ticking...');
	for (var i = 0; i < 16; i++) {
		game.tick();
	}

	console.log('checking p2 base health is positive and game has not yet ended');
	expect(game.playerById.get(p2['id']).base > 0).toEqual(true)
	expect(game.gameEnd).toEqual(false);

	console.log('ticking...');
	game.tick();
	game.tick(); // this is a bug: gameEnd should be set to true on first tick

	console.log('checking p2 base health is not positive and game has ended');
	expect(game.playerById.get(p2['id']).base < 0).toEqual(true)
	expect(game.gameEnd).toEqual(true);
});


