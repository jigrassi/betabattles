define(['painter', '../ClientState'], function (Painter, ClientState) {

      // Create the canvas
    var w = window;
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext("2d");
    canvas.width = 760;
    canvas.height = 650;
    Painter.defaultStyles();


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
        console.log('updating..');
        clientState.update(newState);
    });

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

    function increaseIncome() {
        console.log('increaseincome');
        socket.emit('increaseIncome');
    }

    function increaseArmy() {
        socket.emit('increaseArmy');
    }

    function setArmyStance(stance) {
        socket.emit('setArmyStance', stance);
    }

    // Draw everything
    var render = function () {
        //Painter.drawBG();
        switch(gstate) {
            case "waiting":
                document.getElementById('loadingScreen').style.display='block';
                document.getElementById('gameCanvas').style.display='none';

                //Painter.drawText('Waiting for Opponent');
                break;
            case "playing":
                Painter.drawBG();
                document.getElementById('gameCanvas').style.display='block';
                document.getElementById('loadingScreen').style.display='none';
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