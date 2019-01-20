import Painter from './painter.js';
import ClientState from '../ClientState.js';

// Create the canvas
var w = window;
var canvas = document.getElementById("game");
var readyButtonElement = document.getElementById("ready");
var usernameElement = document.getElementById("username");

var ctx = canvas.getContext("2d");
canvas.width = 760;
canvas.height = 650;

requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

var clientState = new ClientState();
var painter = new Painter(ctx, canvas);

document.onreadystatechange = function () {
  if(document.readyState === "complete"){
    prepareEventHandlers();
  }
}
// SOCKETS ##################################################

var socket = io('/betabattles');
var display_msg = '';

socket.on('gamestart', function(msg) {
    setState('playing');
});

socket.on('dc', function() {
    setState("dc");
});

socket.on('update', function(newState) {
    clientState.update(newState);
});

socket.on('gameend', function(won) {
    console.log('won ' + won);
});

socket.on('ready', function(readyStateMap) {
    clientState.updateReadyState(readyStateMap);
    if(clientState.oppReadyState) {
        document.getElementById('oppReady').innerHTML = 'Opponent Status:' +  'Ready!';
    } else {
        document.getElementById('oppReady').innerHTML = 'Opponent Status: Not Ready';
    }
});

socket.on('username', function(usernameMap) {
    clientState.updateUsernames(usernameMap);
    if(clientState.oppUsername == null || clientState.oppUsername == '') {
        document.getElementById('oppUsername').innerHTML = 'Opponent: ' +  'Found!';
    } else {
        document.getElementById('oppUsername').innerHTML = 'Opponent: ' + clientState.oppUsername;
    }
});

socket.on('matched', function(usernameMap) {
    clientState.oppPresent = true;
    document.getElementById('oppUsername').innerHTML = 'Opponent: Found!';
});

function setUsername() {
    var username = prompt("Enter your username");
    if (username != null){
        document.getElementById('username').innerHTML = 'You:' + username;
        socket.emit('username', username);
    }
}

function toggleReady() {
    if (clientState.myUsername != null && clientState.myUsername != '') {
        clientState.ready = !clientState.ready;
        document.getElementById('playerStatus').innerHTML = clientState.ready  ? "Your Status: Ready" : "Your Status: Not Ready"
        socket.emit('ready', clientState.ready);
    } else {
        setUsername();
    }
}

// LISTENERS ####################################################
function onKeyDown(e) {
    for (const i in painter.components) {
        let component = painter.components[i];
        if (component.keyListened === e.key) {
            executeEvent(component.onClick);
        }
    }
    switch(e.key) {
        // these keystrokes don't correspond to clicking a UI element
        case 'a':
            setArmyStance('aggressive');
            break;
        case 's':
            setArmyStance('passive');
            break;
    }
}

function handleCanvasClick(e) {
    var x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    var y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    x -= e.target.offsetLeft;
    y -= e.target.offsetTop;

    for (const i in painter.components) {
        let component = painter.components[i];
        if (component.collides(x, y)) {
            executeEvent(component.onClick);
        }
    }
}

function executeEvent(eventName) {
    // i don't like this switch but haven't figured out how to avoid it (dependency inversion?)
    switch(eventName) {
        case 'increaseIncome':
            increaseIncome();
            break;
        case 'increaseArmy':
            increaseArmy();
            break;
        case 'toggleArmyStance':
            toggleArmyStance();
            break;
    }
}

function prepareEventHandlers() {
    window.addEventListener('keypress', onKeyDown, false);
    usernameElement.addEventListener('click', setUsername, false);
    readyButtonElement.addEventListener('click', toggleReady, false);

    var canvas = document.getElementById("game");
    canvas.addEventListener('click', handleCanvasClick, false);
}

// MAIN LOOP STUFF ##############################################
var gstate = "waiting";

function setState(state) {
    gstate = state;
}

function increaseIncome() {
    if (clientState.funds < 5) {
        return;
    }
    socket.emit('increaseIncome');
}

function increaseArmy() {
    if (clientState.funds < 5) {
        return;
    }
    socket.emit('increaseArmy');
}

function setArmyStance(stance) {
    if (stance == clientState.myArmyStance) {
        return;
    }
    socket.emit('setArmyStance', stance);
}

function toggleArmyStance() {
    if (clientState.myArmyStance == 'passive') {
        socket.emit('setArmyStance', 'aggressive');
    } else {
        socket.emit('setArmyStance', 'passive');
    }
}

// Draw everything
var render = function () {
    switch (gstate) {
        case "waiting":
            document.getElementById('loadingScreen').style.display='block';
            document.getElementById('gameCanvas').style.display='none';
            break;
        case "playing":
            painter.drawBG();
            document.getElementById('gameCanvas').style.display='block';
            document.getElementById('loadingScreen').style.display='none';
            painter.drawGameState(clientState);
            if(clientState.gameEnd) {
                if(clientState.youWin) {
                    painter.drawText('You Win!');
                } else {
                    painter.drawText('Get Rekt!');
                }
            }
            break;
        case "dc":
            painter.drawText('Disconnected');
            break;
    }
};

// The main paint loop
var jayme = function () {
    render();
    requestAnimationFrame(jayme);
};
w.onload = jayme;