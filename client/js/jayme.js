define(['painter'], function (Painter) {

      // Create the canvas
    var w = window;
    var canvas = document.getElementById("game");
    var ctx = canvas.getContext("2d");
    canvas.width = 760;
    canvas.height = 650;

    requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

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
    })

    // MAIN LOOP STUFF ##############################################
    var gstate = "waiting";

    function setState(state) {
        gstate = state;
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