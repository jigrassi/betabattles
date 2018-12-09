define(['painter', '../ClientState'], function (Painter, ClientState) {

      // Create the canvas
    var w = window;
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext("2d");
    canvas.width = 760;
    canvas.height = 650;

    requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

    clientState = new ClientState();

    // if (document.readyState === "complete") { prepareEventHandlers(); }

    // SOCKETS ##################################################

    var socket = io('/betabattles');
    var display_msg = '';

    socket.on('fuck', function(msg) {
        display_msg = msg;
        setState('fuck');
    });

    socket.on('dc', function() {
        setState("dc");
    });

    socket.on('update', function(newState) {
        clientState.update(newState);
    });

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
            case "fuck":
                Painter.drawText(display_msg);
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