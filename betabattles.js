console.log("hello world");

var server;
var client;

setInterval(tick, 500);

function init() {
    server = new serverState();
    console.log(server);
    client = new clientState(this.server);
}

function run() {
    display();
}

function display() {
    document.getElementById('funds').innerHTML = 'funds:' + client.funds;
    document.getElementById('income').innerHTML = 'income:' + client.income;
    document.getElementById('myArmy').innerHTML = 'myArmy:' + client.myArmy;
    document.getElementById('oppArmy').innerHTML = 'oppArmy:' + client.oppArmy;
    document.getElementById('myArmyStance').innerHTML = 'myArmyStance:' + client.myArmyStance;
    document.getElementById('oppArmyStance').innerHTML = 'oppArmyStance:' + client.oppArmyStance;
    document.getElementById('myBase').innerHTML = 'myBase:' + client.myBase;
    document.getElementById('oppBase').innerHTML = 'oppBase:' + client.oppBase;
}

function tick() {
    if(server == null) {
        console.log("??");
        return;
    }
    console.log('ticking');
    var playerState = server.tick();
    client.update(playerState);
    display();
}