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
painter.defaultStyles();

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
    console.log(e.key);
    switch(e.key) {
        case 'e':
            increaseIncome();
            break;
        case 'a':
            setArmyStance('aggressive');
            break;
        case 's':
            setArmyStance('passive');
            break;
        case 'r':
            increaseArmy();
            break;
    }
}

function handleCanvasClick(e) {
    var x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    var y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    x -= e.target.offsetLeft;
    y -= e.target.offsetTop;

    if ((Math.pow(200-x,2) + Math.pow(150-y,2)) < Math.pow(Math.log(clientState.income+1)*10 + 30,2)) {
        increaseIncome();
    } else if ((Math.pow(200-x,2) + Math.pow(325-y,2)) < Math.pow(Math.log(clientState.myArmy+1)*10 + 30,2)){
        increaseArmy();
    }

    for (i in painter.components) {
        component = painter.components[i];
        if (component.collides(x, y)) {
            component.onClick();
            return;
        }
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
            painter.drawPlayerData(clientState);
            painter.drawOpponentData(clientState);
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