define(['painter', '../ClientState'], function (Painter, ClientState) {

      // Create the canvas
    var w = window;
    var canvas = document.getElementById("game");
    var readyButtonElement = document.getElementById("ready");
    var usernameElement = document.getElementById("username");

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

    socket.on('gameend', function(won) {
        console.log('won ' + won);
    });

    socket.on('ready', function(readyStateMap) {
        console.log('updating..');
        clientState.updateReadyState(readyStateMap);
    });

    function setUsername() {
        var username = prompt("Enter your username");
        if (username != null){
            document.getElementById('username').innerHTML = 'You:' + username;
            clientState.setUsername(username);
        }
    }

    function toggleReady() {
        if (clientState.username != null) {
            clientState.ready = !clientState.ready;
            //document.getElementById('playerStatus').innerHTML = clientState.ready  ? "Your Status: Ready" : "Your Status: Not Ready"
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

    function prepareEventHandlers() {
        var canvasPosition = {
            x: canvas.offsetLeft,
            y: canvas.offsetTop
        };

        window.addEventListener('keypress', onKeyDown, false);
        usernameElement.addEventListener('click', setUsername, false);
        readyButtonElement.addEventListener('click', toggleReady, false);


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
                Painter.drawBG();
                document.getElementById('gameCanvas').style.display='block';
                document.getElementById('loadingScreen').style.display='none';
                Painter.drawPlayerData(clientState);
                Painter.drawOpponentData(clientState);
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