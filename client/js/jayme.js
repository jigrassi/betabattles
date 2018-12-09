define(['painter', '../ClientState'], function (Painter, ClientState) {

      // Create the canvas
    var w = window;
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext("2d");
    canvas.width = 760;
    canvas.height = 650;

    Painter.defaultStyles();

    requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

    clientState = new ClientState();

    if (document.readyState === "complete") { prepareEventHandlers(); }

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

    // LISTENERS ####################################################
    function onKeyDown(e) {
        switch(e) {
            case 101:
                increaseIncome();
                break;
            case 97:
                setArmyStance('aggressive');
                break;
            case 115:
                setArmyStance('passive');
                break;
            case 114:
                increaseArmy();
                break;
        }
    }

    function prepareEventHandlers() {
        var canvasPosition = {
            x: canvas.offsetLeft,
            y: canvas.offsetTop
        };

        window.addEventListener('keypress', onKeyDown, false);
        // canvas.addEventListener('click', function(e) {
        //     var mouse = {
        //         x: e.pageX - canvasPosition.x,
        //         y: e.pageY - canvasPosition.y
        //     };
        // }, false);

        // canvas.addEventListener('mousemove', function(e) {
        //     var mouse = {
        //         x: e.pageX - canvasPosition.x,
        //         y: e.pageY - canvasPosition.y
        //     };
        // }, false);
    }

    // MAIN LOOP STUFF ##############################################
    var gstate = "waiting";

    function setState(state) {
        gstate = state;
    }

    function setArmyStance(stance) {
        socket.emit('setPlayerArmyStance', stance);
    }

    function increaseIncome() {
        socket.emit('increasePlayerFunds');
    }

    function increaseArmy() {
        socket.emit('increaseArmy');
    }

    // Draw everything
    var render = function () {
        Painter.drawBG();

        switch(gstate) {
            case "waiting":
                Painter.drawText('Waiting for Opponent');
                break;
            case "playing":
                Painter.drawPlayerData(clientState);
                break;
            case "dc":
                Painter.drawText('Disconnected');
                break;
        }
    };

    // The main paint loop
    var main = function () {
        render();
        requestAnimationFrame(main);
    };

    return {
        run: main
    };
});